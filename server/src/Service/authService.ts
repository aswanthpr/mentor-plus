import bcrypt from "bcrypt";
import { ObjectId } from "mongoose";
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
import { ImentorApplyData, IuserDetailsHeader } from "../Types";
import { InotificationRepository } from "../Interface/Notification/InotificationRepository";
import { socketManager } from "../index";
import { Status } from "../Constants/httpStatusCode";
import { HttpResponse, NOTIFY } from "../Constants/httpResponse";
import { HttpError } from "../Utils/http-error-handler.util";
import { UserHeaderDTO } from "../dto/common/userHeaderInfoDTO";
import { MenteeDTO } from "../dto/mentee/menteeDTO";

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
  ): Promise<{ success: boolean; message: string; status: number }> {
    try {
      if (!userData.email || !userData.password) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status?.BadRequest,
        };
      }

      const existingUser: Imentee | null =
        await this._MenteeRepository.findByEmail(userData?.email);

      if (
        (existingUser?.email && existingUser?.verified) ||
        existingUser?.provider === "google"
      ) {
        return {
          success: false,
          message: HttpResponse?.EMAIL_EXIST,
          status: Status?.BadRequest,
        };
      } else if (existingUser?.email && !existingUser?.verified) {
        return {
          success: true,
          message: HttpResponse?.SUCCESS,
          status: Status?.Ok,
        };
      }
      // pass hasing
      const hashPassword = await hash_pass(userData.password);
      userData.password = hashPassword;

      const response = await this._MenteeRepository.create_Mentee(userData);

      if (!response) {
        return {
          success: false,
          message: HttpResponse?.FAILED,
          status: Status?.BadRequest,
        };
      }

      const notfi = await this._notificationRepository.createNotification(
        response?._id as unknown as ObjectId,
        `Welcome ${response?.name}`,
        NOTIFY?.MENTEE_WELCOME,
        `mentee`,
        `${process.env.CLIENT_ORIGIN_URL}/mentee/explore`
      );
      if (response?.id && notfi) {
        socketManager.sendNotification(
          response?._id as unknown as string,
          notfi
        );
      }
      return {
        success: true,
        message: HttpResponse?.SUCCESS,
        status: Status?.Ok,
      };
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
    }
  }
  async mainLogin(
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    refreshToken?: string;
    accessToken?: string;
    user?: IuserDetailsHeader;
  }> {
    try {
      if (!email || !password) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status?.BadRequest,
        };
      }
      const result: Imentee | null = await this._MenteeRepository.mainLogin(
        email
      );
      if (result?.provider != "email") {
        return {
          success: false,
          message: HttpResponse?.LOGIN_WITH_GOOGLE,
          status: Status?.BadRequest,
        };
      }
      if (!result || result?.email != email) {
        return {
          success: false,
          message: HttpResponse?.USER_NOT_FOUND,
          status: Status?.BadRequest,
        };
      }
      if (result?.isAdmin) {
        return {
          success: false,
          message: HttpResponse?.ADMIN_NOT_ALLOWEDED,
          status: Status?.Unauthorized,
        };
      }

      if (result?.isBlocked) {
        return {
          success: false,
          message: HttpResponse?.USER_BLOCKED,
          status: Status?.Unauthorized,
        };
      }

      const checkUser = await bcrypt.compare(
        password,
        result?.password as string
      );

      if (!checkUser) {
        return {
          success: false,
          message: HttpResponse?.PASSWORD_INCORRECT,
          status: Status.BadRequest,
        };
      }

      const userId = String(result?._id);

      const accessToken = genAccesssToken(userId as string, "mentee");
      const refreshToken = genRefreshToken(userId as string, "mentee");

      //map with dto
      const userDto = UserHeaderDTO.single(result);

      return {
        success: true,
        message: HttpResponse?.SUCCESS,
        refreshToken,
        accessToken,
        status: Status?.Ok,
        user: userDto as IuserDetailsHeader,
      };
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
    }
  }

  //forget password mentor and mentee;
  async forgotPassword(
    email: string
  ): Promise<
    { success: boolean; message: string; status: number } | undefined
  > {
    try {
      if (!email) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status?.BadRequest,
        };
      }
      const result = await this._MenteeRepository.findByEmail(email);
      if (!result?.email || result?.isBlocked) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status?.BadRequest,
        };
      }
      await this._OtpService.sentOtptoMail(email);

      return {
        success: true,
        message: HttpResponse?.OTP_SEND_TO_MAIL,
        status: Status?.Ok,
      };
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
    }
  }
  async forgot_PasswordChange(
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string; status: number }> {
    try {
      if (!email || !password) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status?.BadRequest,
        };
      }
      const hashedPassword: string = await hash_pass(password);

      const result = await this._MenteeRepository.forgot_PasswordChange(
        email,
        hashedPassword
      );

      if (!result) {
        return {
          success: false,
          message: HttpResponse?.USER_NOT_FOUND,
          status: Status?.BadRequest,
        };
      }

      return {
        success: true,
        message: HttpResponse?.PASSWORD_CHANGE_SUCCESS,
        status: Status?.Ok,
      };
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
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
        return {
          success: false,
          message: HttpResponse?.RESOURCE_NOT_FOUND,
          status: Status?.NoContent,
        };
      }
      return {
        success: true,
        message: HttpResponse?.RESOURCE_FOUND,
        status: Status?.Ok,
        categories: result,
      };
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
    }
  }
  async adminLogin(
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    accessToken: string | null;
    refreshToken: string | null;
  }> {
    try {
      if (!email || !password) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status?.BadRequest,
          refreshToken: null,
          accessToken: null,
        };
      }
      const result = await this._MenteeRepository.findByEmail(email);
      // adminLogin(email);

      if (!result) {
        return {
          success: false,
          message: HttpResponse?.USER_NOT_FOUND,
          status: Status?.BadRequest,
          refreshToken: null,
          accessToken: null,
        };
      }

      if (!result?.isAdmin) {
        return {
          success: false,
          message: HttpResponse?.UNAUTHORIZED,
          status: Status?.BadRequest,
          refreshToken: null,
          accessToken: null,
        };
      }

      if (result?.isBlocked) {
        return {
          success: false,
          message: HttpResponse?.UNAUTHORIZED,
          status: Status?.BadRequest,
          refreshToken: null,
          accessToken: null,
        };
      }
      const checkUser = await bcrypt.compare(
        password,
        result?.password as string
      );

      if (!checkUser) {
        return {
          success: false,
          message: HttpResponse?.PASSWORD_INCORRECT,
          status: Status?.BadRequest,
          refreshToken: null,
          accessToken: null,
        };
      }
      const userId = String(result?._id);

      const accessToken = genAccesssToken(userId as string, "admin") as string;
      const refreshToken = genRefreshToken(userId as string, "admin") as string;

      return {
        success: true,
        message: HttpResponse?.SUCCESS,
        status: Status?.Ok,
        accessToken,
        refreshToken,
      };
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
    }
  }

  async mentorApply(
    mentorData: ImentorApplyData
  ): Promise<{ success: boolean; message: string; status: number }> {
    try {
      const { email, phone } = mentorData.body;
      const { profileImage, resume } = mentorData.files;

      if (!email || !phone || !profileImage || !resume || !mentorData?.files) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status?.BadRequest,
        };
      }
      const response = await this._MentorRepository.findMentor(email, phone);

      if (response?.email) {
        return {
          success: false,
          message: HttpResponse?.EMAIL_EXIST,
          status: Status?.Conflict,
        };
      }
      if (response?.phone) {
        return {
          success: false,
          message: HttpResponse?.PHONE_EXIST,
          status: Status?.Conflict,
        };
      }

      const hashPass = await hash_pass(mentorData.body.password);

      if (!hashPass) {
        throw new Error("error while hashing password in mentor apply");
      }

      mentorData.body = { ...mentorData.body, password: hashPass };

      const imageUrl = await uploadImage(profileImage?.buffer);
      const fileUrl = await uploadFile(resume?.buffer, resume?.originalname);

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
          message: HttpResponse?.USER_CREATION_FAILED,
          status: Status?.Conflict,
        };
      }
      const admin = await this._MenteeRepository._find();
      const notifi = await this._notificationRepository.createNotification(
        admin?._id as unknown as ObjectId,
        `New Mentor Has Joined!`,
        `${result?.name} ${NOTIFY?.ADMIN_NEW_MENTOR_NOTIFY}`,
        "admin",
        `${process.env.CLIENT_ORIGIN_URL}/admin/mentor_management/not_verified`
      );
      if (admin?._id && notifi) {
        socketManager.sendNotification(String(admin?._id), notifi);
      }
      return {
        success: true,
        message: HttpResponse?.APPLICATION_SUBMITTED,
        status: Status?.Ok,
      };
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
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
    user?: IuserDetailsHeader;
  }> {
    try {
      if (!email || !password) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status?.BadRequest,
        };
      }

      const result = await this._MentorRepository.findMentor(email);
      if (!result) {
        return {
          success: false,
          message: HttpResponse?.INVALID_EMAIL,
          status: Status?.NotFound,
        };
      }
      if (!result?.verified) {
        return {
          success: false,
          message: HttpResponse?.MENTEE_NOTIFICATION,
          status: Status?.Unauthorized,
        };
      }
      if (result?.isBlocked) {
        return {
          success: false,
          message: HttpResponse?.UNAUTHORIZED,
          status: Status?.Unauthorized,
        };
      }

      const checkPass = await bcrypt.compare(password, result?.password);

      if (!checkPass) {
        return {
          success: false,
          message: HttpResponse?.PASSWORD_INCORRECT,
          status: Status?.BadRequest,
        };
      }
      const mentorId = `${result._id}`;

      const accessToken = genAccesssToken(mentorId as string, "mentor");
      const refreshToken = genRefreshToken(mentorId as string, "mentor");

      // map userdata with Dto
      const userDto = UserHeaderDTO.single(result);

      return {
        success: true,
        message: HttpResponse?.SUCCESS,
        status: Status?.Ok,
        accessToken,
        refreshToken,
        user: userDto as IuserDetailsHeader,
      };
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
    }
  }
  async mentorForgotPassword(
    email: string
  ): Promise<{ success: boolean; message: string; status: number }> {
    try {
      if (!email) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status?.BadRequest,
        };
      }
      const result = await this._MentorRepository.findMentor(email);
      if (!result || result?.isBlocked) {
        return {
          success: false,
          message: HttpResponse?.OTP_FAILED_TO_SEND,
          status: Status?.BadRequest,
        };
      }
      await this._OtpService.sentOtptoMail(email);
      return {
        success: true,
        message: HttpResponse?.OTP_SEND_TO_MAIL,
        status: Status?.Ok,
      };
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
    }
  }
  async mentorForgot_PasswordChange(
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string; status: number }> {
    try {
      if (!email || !password) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status?.BadRequest,
        };
      }
      const hashedPassword: string = await hash_pass(password);

      const result = await this._MentorRepository.findMentorAndUpdate(
        email,
        hashedPassword
      );

      if (!result) {
        return {
          success: false,
          message: HttpResponse?.USER_NOT_FOUND,
          status: Status?.NotFound,
        };
      }
      return {
        success: true,
        message: HttpResponse?.PASSWORD_CHANGE_SUCCESS,
        status: Status?.Ok,
      };
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
    }
  }
  async googleAuth(user: Imentee): Promise<{
    success: boolean;
    message: string;
    status: number;
    accessToken?: string;
    refreshToken?: string;
    user?: MenteeDTO;
  }> {
    try {
      if (!user) {
        throw new Error("user deailes not found");
      }
      const accessToken = genAccesssToken(String(user?._id), "mentee");
      const refreshToken = genRefreshToken(String(user?._id), "mentee");
      
      //map mentee data with dto
      const menteeDTO = MenteeDTO.single(user);
      const encodedDTO = {
        ...menteeDTO,
        name: encodeURIComponent(menteeDTO.name),
        email: encodeURIComponent(menteeDTO.email),
        profileUrl: encodeURIComponent(menteeDTO.profileUrl || ""),
      };
      return {
        success: true,
        message: HttpResponse?.SUCCESS,
        status: Status?.Ok,
        accessToken,
        refreshToken,
        user: encodedDTO,
      };
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
    }
  }
}
