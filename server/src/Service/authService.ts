import bcrypt from "bcrypt";
import hash_pass from "../Utils/hashPass.util";
import { Imentee } from "../Model/menteeModel";
import { Icategory } from "../Model/categorySchema";
import IotpService from "../Interface/Otp/iOtpService";
import IauthService from "../Interface/Auth/iAuthService";
import { genAccesssToken, genRefreshToken } from "../Utils/jwt.utils";
import { ImentorRepository } from "../Interface/Mentor/iMentorRepository";
import { uploadFile, uploadImage } from "../Config/cloudinary.util";
import { IcategoryRepository } from "../Interface/Category/iCategoryRepository";
import { ImenteeRepository } from "../Interface/Mentee/iMenteeRepository";
import { ImentorApplyData } from "../Types";
import { InotificationRepository } from "../Interface/Notification/InotificationRepository";
import { ObjectId } from "mongoose";
import {socketManager } from "../index";
import { Status } from "../Utils/httpStatusCode";


export class authService implements IauthService {
  constructor(
    private _OtpService: IotpService,
    private _categoryRepository: IcategoryRepository,
    private _MentorRepository: ImentorRepository,
    private _MenteeRepository: ImenteeRepository,
    private _notificationRepository: InotificationRepository
  ) {}

  async mentee_Signup(
    userData: Imentee
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

      const response = await this._MenteeRepository.create_Mentee(userData);

      if (!response) {
        return {
          success: false,
          message: "Singup Failed",
        };
      }

      const notfi = await this._notificationRepository.createNotification(
        response?._id as ObjectId,
        `Welcome ${response?.name}`,
        `Start exploring and connect with mentors today.`,
        `mentee`,
        `${process.env.CLIENT_ORIGIN_URL}/mentee/explore`
      );
      if ( response?.id && notfi) {
        socketManager.sendNotification(response?._id as string, notfi)
      }
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
  async mainLogin(
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    message: string;
    status:number;
    refreshToken?: string;
    accessToken?: string;
  }> {
    try {
     

      if (!email || !password) {
        return { success: false, message: "login credencial is missing",status:Status?.BadRequest };
      }
      const result: Imentee | null = await this._MenteeRepository.mainLogin(
        email
      );

      if (!result || result?.email != email) {
        return { success: false, message: "user not exist.Please signup",status:Status?.BadRequest };
      }
      if (result?.isAdmin) {
        return { success: false, message: "Admin is not allowed ,sorry..",status:Status?.Unauthorized };
      }

      if (result?.isBlocked) {
        return { success: false, message: "user blocked .sorry..",status:Status?.Unauthorized };
      }

      const checkUser = await bcrypt.compare(password, result.password!);

      if (!checkUser) {
        return { success: false, message: "password not matching" ,status:Status.BadRequest};
      }

      const userId: string = result._id as string;
     
      const accessToken = genAccesssToken(userId as string,"mentee");
      const refreshToken = genRefreshToken(userId as string,"mentee");
      
      return {
        success: true,
        message: "Login Successfull",
        refreshToken,
        accessToken,
        status:Status?.Ok
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
  async forgotPassword(
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
  async forgot_PasswordChange(
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string } | undefined> {
    try {
      if (!email || !password) {
        return { success: false, message: "credencial is missing" };
      }
      const hashedPassword: string = await hash_pass(password);
      console.log(hashedPassword, "hash");
      const result = await this._MenteeRepository.forgot_PasswordChange(
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

  async mentorFields(): Promise<{
    success: boolean;
    message: string;
    status: number;
    categories?: Icategory[];
  }> {
    try {
      const result = await this._categoryRepository.allCategoryData();
      if (!result) {
        return { success: false, message: "No data found ", status:  Status?.NoContent };
      }
      return {
        success: true,
        message: "data found",
        status:  Status?.Ok,
        categories: result,
      };
    } catch (error: unknown) {
      throw new Error(`error while forget password in BLforgetPassword
        ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  async adminLogin(
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
      const result = await this._MenteeRepository.adminLogin(email);

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

      const accessToken = genAccesssToken(userId as string,"admin");
      const refreshToken = genRefreshToken(userId as string,"admin");
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

  async mentorApply(
    mentorData: ImentorApplyData
  ): Promise<{ success: boolean; message: string; status: number }> {
    try {
      const { email, phone } = mentorData.body;
      const { profileImage, resume } = mentorData.files;

      if (!mentorData.body || !mentorData.files) {
        return {
          success: false,
          message: "credential is missing",
          status:  Status?.BadRequest,
        };
      }
      const response = await this._MentorRepository.findMentor(email, phone);

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
      const result = await this._MentorRepository.createMentor(
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
      const admin = await this._MenteeRepository._find();
     const notifi =  await this._notificationRepository.createNotification(
        admin?._id as ObjectId,
        `New Mentor Has Joined!`,
        `${result?.name} Applied as mentor. Please review their profile and verify`,
        "admin",
        `${process.env.CLIENT_ORIGIN_URL}/admin/mentor_management/not_verified`
      );
      if(admin?._id && notifi){

        socketManager.sendNotification(admin?._id as string, notifi)
      }
      return {
        success: true,
        message: "Mentor application submitted!",
        status:  Status?.Ok,
      };
    } catch (error: unknown) {
      console.error("Error while mentor appling", error);
      return {
        success: false,
        message: "unexpected error occured",
        status:  Status?.InternalServerError,
      };
    }
  }
  //mentor login
  async mentorLogin(
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
          status:  Status?.BadRequest,
        };
      }

      const result = await this._MentorRepository.findMentor(email);
      if (!result) {
        return {
          success: false,
          message: "user with the provided email not found",
          status: Status?.NotFound,
        };
      }
      if (!result?.verified) {
        return {
          success: false,
          message: `You're on our waitlist!
                   Thanks for signing up for MentorPlus.
                    We're focused on creating the best experience possible for everyone on the site.`,
          status: Status?.Unauthorized,
        };
      }
      if (result?.isBlocked) {
        return { success: false, message: "User is  Blocked!", status: Status?.Unauthorized };
      }

      const checkPass = await bcrypt.compare(password, result?.password);
      console.log(checkPass)
      if (!checkPass) {
        return { success: false, message: "Incorrect password", status: Status?.BadRequest };
      }
      const mentorId = `${result._id}`;
      console.log(mentorId, "userid");
      const accessToken = genAccesssToken(mentorId as string,"mentor");
      const refreshToken = genRefreshToken(mentorId as string,"mentor");

      console.log(accessToken, refreshToken, "access refrsh");
      return {
        success: true,
        message: "login successfull!",
        status:  Status?.Ok,
        accessToken,
        refreshToken,
      };
    } catch (error: unknown) {
      throw new Error(`error while forget password in BLforgetPassword
      ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  async mentorForgotPassword(
    email: string
  ): Promise<{ success: boolean; message: string } | undefined> {
    try {
      if (!email) {
        return { success: false, message: "credential is missing" };
      }
      const result = await this._MentorRepository.findMentor(email);
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
  async mentorForgot_PasswordChange(
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string } | undefined> {
    try {
      if (!email || !password) {
        return { success: false, message: "credencial is missing" };
      }
      const hashedPassword: string = await hash_pass(password);
      console.log(hashedPassword, "hash");
      const result = await this._MentorRepository.findMentorAndUpdate(
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
  async googleAuth(user: Imentee): Promise<{
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

      const accessToken = genAccesssToken(user?._id as string,"mentee");
      const refreshToken = genRefreshToken(user?._id as string,"mentee");
console.log(refreshToken,'sfkasdsdfjsjflkslfkjskldjflaskdfjlkasjd',accessToken)
      return {
        success: true,
        message: "login successfull!",
        status:  Status?.Ok,
        accessToken,
        refreshToken,
      };
    } catch (error: unknown) {
      throw new Error(`error while google authentication
      ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
