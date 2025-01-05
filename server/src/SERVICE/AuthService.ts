import bcrypt from "bcrypt";
import hash_pass from "../UTILS/hashPass.util";
import { IMentee } from "../MODEL/MenteeModel";
import { IMentorApplyData } from "../TYPES/index";
import { ICategory } from "../MODEL/categorySchema";
import IOtpService from "../INTERFACE/Otp/IOtpService";
import IAuthService from "../INTERFACE/Auth/IAuthService";
import { genAccesssToken, genRefreshToken } from "../UTILS/jwt.utils";
import { IMentorRepository } from "../INTERFACE/Mentor/IMentorRepository";
import { uploadFile, uploadImage } from "../CONFIG/cloudinary.util";
import { ICategoryRepository } from "../INTERFACE/Category/ICategoryRepository";
import passport from "passport";
import { IMenteeRepository } from "../INTERFACE/Mentee/IMenteeRepository";

export class AuthService implements IAuthService {
  constructor(
    private _OtpService: IOtpService,
    private _categoryRepository: ICategoryRepository,
    private _MentorRepository: IMentorRepository,
    private _MenteeRepository: IMenteeRepository
  ) {}

  async mentee_Signup(
    userData: IMentee
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (!userData.email || !userData.password) {
        return { success: false, message: "Email or password is missing" };
      }
      const existingUser = await this._MenteeRepository.findByEmail(
        userData.email
      );
      if (existingUser) {
        return {
          success: false,
          message: "user with this email is already exists",
        };
      }
      // pass hasing
      const hashPassword = await hash_pass(userData.password);
      userData.password = hashPassword;

      const newMentee = await this._MenteeRepository.create_Mentee(userData);

      return { success: true, message: "signup successfull" };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("\x1b[35m%s\x1b[0m", "error while create mentee");
        throw new Error(`Failed to create  Mentee ${error.message}`);
      } else {
        console.log("An unknown error occured", error);
        throw error;
      }
    }
  }
  async BLMainLogin(
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    message: string;
    refreshToken?: string;
    accessToken?: string;
  }> {
    try {
      console.log(email, password);

      console.log(email, password, "logic");
      if (!email || !password) {
        return { success: false, message: "login credencial is missing" };
      }
      const result: IMentee | null = await this._MenteeRepository.DBMainLogin(
        email
      );
      console.log(result, "1111111111111");
      if (!result || result?.email != email) {
        return { success: false, message: "user not exist.Please signup" };
      }
      if (result?.isAdmin) {
        return { success: false, message: "Admin is not allowed ,sorry.." };
      }
      if (result?.isBlocked) {
        return { success: false, message: "user blocked .sorry.." };
      }
      console.log(password, result.password);
      const checkUser = await bcrypt.compare(password, result?.password!);

      if (!checkUser) {
        return { success: false, message: "password not matching" };
      }
      const userId: string = result._id as string;
      console.log(userId, "userid");
      const accessToken = genAccesssToken(userId as string);
      const refreshToken = genRefreshToken(userId as string);
      console.log(accessToken, refreshToken, "access refrsh");

      return {
        success: true,
        message: "Login Successfull",
        refreshToken,
        accessToken,
      };
    } catch (error: unknown) {
      throw new Error(
        `error in Login service ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  //forget password mentor and mentee;
  async BLforgotPassword(
    email: string
  ): Promise<{ success: boolean; message: string } | undefined> {
    try {
      if (!email) {
        return { success: false, message: "credential is missing" };
      }
      const result = await this._MenteeRepository.findByEmail(email);
      if (!result || result?.isBlocked) {
        return {
          success: false,
          message: "Invalid user type. Otp failed to send",
        };
      }
      await this._OtpService.sentOtptoMail(email);
      return { success: true, message: "Otp success fully send to mail" };
    } catch (error: unknown) {
      console.log(
        `error while forget password in BLforgetPassword`,
        error instanceof Error ? error.message : String(error)
      );
    }
  }
  async BLforgot_PasswordChange(
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string } | undefined> {
    try {
      if (!email || !password) {
        return { success: false, message: "credencial is missing" };
      }
      const hashedPassword: string = await hash_pass(password);
      console.log(hashedPassword, "hash");
      const result = await this._MenteeRepository.DBforgot_PasswordChange(
        email,
        hashedPassword
      );

      console.log(result, "ths is passchange reslut");
      if (!result) {
        return {
          success: false,
          message: "User does not exist. Please sign up.",
        };
      }

      return { success: true, message: "password changed successfully." };
    } catch (error: unknown) {
      console.log(
        `error while forget password in BLforgetPassword`,
        error instanceof Error ? error.message : String(error)
      );
      return { success: false, message: "Internal server error" };
    }
  }

  //amdin login Logic

  async blMentorFields(): Promise<{
    success: boolean;
    message: string;
    status: number;
    categories?: ICategory[];
  }> {
    try {
      const result = await this._categoryRepository.dbcategoryData();
      if (!result) {
        return { success: false, message: "No data found ", status: 204 };
      }
      return {
        success: true,
        message: "data found",
        status: 200,
        categories: result,
      };
    } catch (error: unknown) {
      throw new Error(`error while forget password in BLforgetPassword
        ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  async BLadminLogin(
    email: string,
    password: string
  ): Promise<
    | {
        success: boolean;
        message: string;
        accessToken?: string;
        refreshToken?: string;
      }
    | undefined
  > {
    try {
      if (!email || !password) {
        return { success: false, message: "admin credencial is missing" };
      }
      const result = await this._MenteeRepository.DBadminLogin(email);

      if (!result) {
        return { success: false, message: "Admin not exist" };
      }
      if (!result?.isAdmin) {
        return { success: false, message: "user is not allowed ,sorry.." };
      }
      if (result?.isBlocked) {
        return { success: false, message: "Admin blocked .sorry.." };
      }
      const checkUser = await bcrypt.compare(
        password,
        result?.password as string
      );

      if (!checkUser) {
        return { success: false, message: "password not matching" };
      }
      const userId: string = result._id as string;

      const accessToken = genAccesssToken(userId as string);
      const refreshToken = genRefreshToken(userId as string);
      console.log(accessToken, refreshToken, "access refrsh");

      return {
        success: true,
        message: "Login Successfull",
        refreshToken,
        accessToken,
      };
    } catch (error: unknown) {
      console.error("Error while loging admin", error);
      return { success: false, message: "Admin does't exist" };
    }
  }

  async blMentorApply(
    mentorData: IMentorApplyData
  ): Promise<{ success: boolean; message: string; status: number }> {
    try {
      const {
        name,
        email,
        password,
        phone,
        jobTitle,
        category,
        linkedinUrl,
        githubUrl,
        bio,
        skills,
      } = mentorData.body;
      const { profileImage, resume } = mentorData.files;

      if (!mentorData.body || !mentorData.files) {
        return {
          success: false,
          message: "credential is missing",
          status: 400,
        };
      }
      const response = await this._MentorRepository.dbFindMentor(email, phone);

      if (response?.email) {
        return { success: false, message: "Email already exist ", status: 409 };
      }
      if (response?.phone) {
        return { success: false, message: "phone already exist ", status: 409 };
      }

      const hashPass = await hash_pass(mentorData.body.password);

      if (!hashPass) {
        throw new Error("error while hashing password in mentor apply");
      }

      mentorData.body = { ...mentorData.body, password: hashPass };

      const imageUrl = await uploadImage(profileImage?.buffer);
      const fileUrl = await uploadFile(resume?.buffer, resume?.originalname);
      console.log(imageUrl, fileUrl);

      if (!imageUrl || !fileUrl) {
        throw new Error("error while image url generating");
      }
      const result = await this._MentorRepository.dbCreateMentor(
        mentorData.body,
        imageUrl,
        fileUrl
      );
      if (!result) {
        return {
          success: false,
          message: "unable to create user ",
          status: 409,
        };
      }
      return {
        success: true,
        message: "Mentor application submitted!",
        status: 200,
      };
    } catch (error: unknown) {
      console.error("Error while mentor appling", error);
      return {
        success: false,
        message: "unexpected error occured",
        status: 500,
      };
    }
  }
  //mentor login
  async blMentorLogin(
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    refreshToken?: string;
    accessToken?: string;
  }> {
    try {
      if (!email || !password) {
        return {
          success: false,
          message: `${!email ? "email is required" : "password is required"}`,
          status: 400,
        };
      }

      const result = await this._MentorRepository.dbFindMentor(email);

      console.log(result, "111111111111");
      if (!result) {
        return {
          success: false,
          message: "user with the provided email not found",
          status: 404,
        };
      }
      if (!result?.verified) {
        return {
          success: false,
          message: `You're on our waitlist!
                   Thanks for signing up for MentorPlus.
                    We're focused on creating the best experience possible for everyone on the site.`,
          status: 401,
        };
      }
      if (result?.isBlocked) {
        return { success: false, message: "User is  Blocked!", status: 401 };
      }

      const checkPass = await bcrypt.compare(password, result?.password);
      if (!checkPass) {
        return { success: false, message: "Incorrect password", status: 400 };
      }
      const mentorId: string = result._id as string;
      console.log(mentorId, "userid");
      const accessToken = genAccesssToken(mentorId as string);
      const refreshToken = genRefreshToken(mentorId as string);

      console.log(accessToken, refreshToken, "access refrsh");
      return {
        success: true,
        message: "login successfull!",
        status: 200,
        accessToken,
        refreshToken,
      };
    } catch (error: unknown) {
      throw new Error(`error while forget password in BLforgetPassword
      ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  async blMentorForgotPassword(
    email: string
  ): Promise<{ success: boolean; message: string } | undefined> {
    try {
      if (!email) {
        return { success: false, message: "credential is missing" };
      }
      const result = await this._MentorRepository.dbFindMentor(email);
      if (!result || result?.isBlocked) {
        return {
          success: false,
          message: "Invalid user type. Otp failed to send",
        };
      }
      await this._OtpService.sentOtptoMail(email);
      return { success: true, message: "Otp success fully send to mail" };
    } catch (error: unknown) {
      console.log(
        `error while forget password in BLMentorforgetPassword`,
        error instanceof Error ? error.message : String(error)
      );
    }
  }
  async blMentorForgot_PasswordChange(
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string } | undefined> {
    try {
      if (!email || !password) {
        return { success: false, message: "credencial is missing" };
      }
      const hashedPassword: string = await hash_pass(password);
      console.log(hashedPassword, "hash");
      const result = await this._MentorRepository.dbFindMentorAndUpdate(
        email,
        hashedPassword
      );
      console.log(result, "ths is passchange reslut");
      if (!result) {
        return {
          success: false,
          message: "User does not exist. Please sign up.",
        };
      }

      return { success: true, message: "password changed successfully." };
    } catch (error: unknown) {
      console.log(
        `error while forget password in BLforgetPassword`,
        error instanceof Error ? error.message : String(error)
      );
      return { success: false, message: "Internal server error" };
    }
  }
  async blGoogleAuth(
    user: any
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    accessToken?: string;
    refreshToken?: string;
  }> {
    try {
      if (!user) {
        throw new Error("user deailes not found");
      }
      const accessToken = genAccesssToken(user?._id as string);
      const refreshToken = genRefreshToken(user?._id as string);

      console.log(accessToken, refreshToken, "access refrsh");


      return {
        success: true,
        message: "login successfull!",
        status: 200,
        accessToken,
        refreshToken,
      };

    } catch (error: unknown) {
      throw new Error(`error while google authentication
      ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
