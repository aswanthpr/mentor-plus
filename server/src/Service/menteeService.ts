import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ImenteeService } from "../Interface/Mentee/iMenteeService";
import { Imentee } from "../Model/menteeModel";
import { ImenteeRepository } from "../Interface/Mentee/iMenteeRepository";
import hash_pass from "../Utils/hashPass.util";
import { uploadImage } from "../Config/cloudinary.util";
import {
  genAccesssToken,
  genRefreshToken,
  verifyRefreshToken,
} from "../Utils/jwt.utils";
import { Imentor } from "../Model/mentorModel";
import { ImentorRepository } from "../Interface/Mentor/iMentorRepository";
import { IcategoryRepository } from "../Interface/Category/iCategoryRepository";
import { Icategory } from "../Model/categorySchema";
import { Iquestion } from "../Model/questionModal";
import { IquestionRepository } from "../Interface/Qa/IquestionRepository";
import { Status } from "../Utils/httpStatusCode";
import { Itime } from "src/Model/timeModel";
import { ItimeSlotRepository } from "src/Interface/timeSchedule/iTimeSchedule";

export class menteeService implements ImenteeService {
  constructor(
    private _menteeRepository: ImenteeRepository,
    private _mentorRepository: ImentorRepository,
    private _categoryRepository: IcategoryRepository,
    private _questionRepository: IquestionRepository,
    private _timeSlotRepository:ItimeSlotRepository,
  ) {}

  async menteeProfile(refreshToken: string): Promise<{
    success: boolean;
    message: string;
    result: Imentee | null;
    status: number;
  }> {
    try {
      const decode = jwt.verify(
        refreshToken,
        process.env?.JWT_ACCESS_SECRET as string
      ) as { userId: string };

      if (!decode) {
        return {
          success: false,
          message: "Your session has expired. Please log in again.",
          status: 403,
          result: null,
        };
      }

      const result = await this._menteeRepository.findById(decode.userId);
      if (!result) {
        return {
          success: false,
          message: "invalid credential",
          status: 403,
          result: null,
        };
      }

      return { success: true, message: "success", result: result, status: 200 };
    } catch (error: unknown) {
      throw new Error(
        `Error while bl metneeProfile in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async editMenteeProfile(formData: Partial<Imentee>): Promise<{
    success: boolean;
    message: string;
    result: Imentee | null;
    status: number;
  }> {
    try {
      console.log(formData);
      if (!formData) {
        return {
          success: false,
          message: "credential is  missing",
          status: 400,
          result: null,
        };
      }

      const result = await this._menteeRepository.editMentee(formData);

      console.log(result, "this is edit mentee result");
      if (!result) {
        return {
          success: false,
          message: "mentee not found",
          status: 401,
          result: null,
        };
      }
      return {
        success: true,
        message: "edit successfully",
        status: 200,
        result: result,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error while bl metneeProfile edit in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  //metnee profile pass chagne

  async passwordChange(
    currentPassword: string,
    newPassword: string,
    _id: string
  ): Promise<{ success: boolean; message: string; status: number }> {
    try {
      if (!currentPassword || !newPassword || !_id) {
        return {
          success: false,
          message: "credentials not found",
          status: 400,
        };
      }
      if (currentPassword == newPassword) {
        return {
          success: false,
          message: "new password cannto be same as current password",
          status: 401,
        };
      }
      const result = await this._menteeRepository.findById(_id);
      if (!result) {
        return { success: false, message: "invalid credential ", status: 401 };
      }

      const passCompare = await bcrypt.compare(
        currentPassword,
        `${result?.password}`
      );
      if (!passCompare) {
        return {
          success: false,
          message: "incorrect current  password",
          status: 401,
        };
      }
      const hashPass = await hash_pass(newPassword);
      const response = await this._menteeRepository.changePassword(
        _id,
        hashPass
      );
      if (!response) {
        return { success: false, message: "updation failed", status: 503 };
      }
      return { success: true, message: "updation successfull", status: 200 };
    } catch (error: unknown) {
      throw new Error(
        `Error while bl metneeProfile password change in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async profileChange(
    image: Express.Multer.File | null,
    id: string
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    profileUrl?: string;
  }> {
    try {
      if (!image || !id) {
        return { success: false, message: "credential not found", status: 400 };
      }
      const profileUrl = await uploadImage(image?.buffer);

      const result = await this._menteeRepository.profileChange(profileUrl, id);

      if (!result) {
        return { success: false, message: "user not found", status: 401 };
      }
      return {
        success: true,
        message: "updation successfull",
        status: 200,
        profileUrl: result.profileUrl,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error while bl metnee Profile  change in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async refreshToken(refresh: string): Promise<{
    success: boolean;
    message: string;
    status: number;
    accessToken?: string;
    refreshToken?: string;
  }> {
    try {
      if (!refresh) {
        return { success: false, message: "RefreshToken missing", status: 401 };
      }

      const decode = verifyRefreshToken(refresh);

      if (!decode) {
        return {
          success: false,
          message: "Your session has expired. Please log in again.",
          status: 401,
        };
      }

      const { userId } = decode;

      const accessToken: string | undefined = genAccesssToken(userId as string);

      const refreshToken: string | undefined = genRefreshToken(
        userId as string
      );

      return {
        success: true,
        message: "Token refresh successfully",
        accessToken,
        refreshToken,
        status: 200,
      };
    } catch (error: unknown) {
      console.error("Error while generating access or refresh token:", error);
      return { success: false, message: "Internal server error", status: 500 };
    }
  }

  //metnor data fetching for explore
  async exploreData(): Promise<{
    success: boolean;
    message: string;
    status: number;
    mentor?: Imentor[] | null;
    category?: Icategory[] | null;
    skills: Imentor[] | undefined;
  }> {
    try {
      const mentorData = await this._mentorRepository.findAllMentor();
      if (!mentorData) {
        return {
          success: false,
          message: "Data not found",
          status: 404,
          skills: undefined,
        };
      }
      console.log(mentorData, "sfasfaf");
      const categoryData = await this._categoryRepository.categoryData();
      if (!categoryData) {
        return {
          success: false,
          message: "Data not found",
          status: 404,
          skills: undefined,
        };
      }
      const categoryWithSkill =
        await this._mentorRepository.categoryWithSkills();

      return {
        success: false,
        message: "Data fetch successfully ",
        status: 200,
        mentor: mentorData,
        category: categoryData,
        skills: categoryWithSkill,
      };
    } catch (error: unknown) {
      console.error(
        "\x1b[34m%s\x1b[0m",
        "Error while generating access or refresh token:",
        error
      );
      return {
        success: false,
        message: "Internal server error",
        status: 500,
        skills: undefined,
      };
    }
  }

  async homeData(
    filter: string
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    homeData: Iquestion[] | null;
  }> {
    try {
      if (!filter) {
        return {
          success: false,
          message: "credentials not found",
          status: 400,
          homeData: null,
        };
      }

      const response = await this._questionRepository.allQuestionData(filter);
      if (!response) {
        return {
          success: false,
          message: "Data not found",
          status: 404,
          homeData: null,
        };
      }
      return {
        success: true,
        message: "Data successfully fetched",
        status: 200,
        homeData: response,
      };
    } catch (error: unknown) {
      console.error(
        "\x1b[34m%s\x1b[0m",
        "Error while generating access or refresh token:",
        error
      );
      return {
        success: false,
        message: "Internal server error",
        status: 500,
        homeData: null,
      };
    }
  }
  // /mentee/explor/mentor/:id
  async getMentorDetailes(
    category:string,
    mentorId: string,
    
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    mentor: Imentor[] | [];
  }> {
    try {
      if (!mentorId) {
        return {
          status: Status.BadRequest,
          message: "credential not found",
          success: false,
          mentor: [],
        };
      }
      const response = await this._mentorRepository.findMentorsByCategory(
        category as string,
        mentorId
      );
      if (!response) {
        return {
          status: Status.Ok,
          message: "Data not found",
          success: false,
          mentor: [],
        };
      }
      return {
        status: Status.Ok,
        message: "Data fetched successfully",
        success: true,
        mentor: response,
      };
    } catch (error: unknown) {
      throw new Error(
        `${
          error instanceof Error ? error.message : String(error)
        } error while gettign mentor data in mentee service`
      );
    }
  }


  async getTimeSlots(mentorId: string): Promise<{ success: boolean; message: string; status: number; timeSlots: Itime[] | []; }> {
    try {
      if (!mentorId) {
        return {
          status: Status.BadRequest,
          message: "credential not found",
          success: false,
         timeSlots: [],
        };
      }
      const response = await this._timeSlotRepository.getMentorSlots(mentorId);
      if (!response) {
        return {
          status: Status.Ok,
          message: "Data not found",
          success: false,
          timeSlots: [],
        };
      }
      console.log(response,'from service')
      return {
        status: Status.Ok,
        message: "Data fetched successfully",
        success: true,
        timeSlots: response,
      };
    } catch (error:unknown) {
      throw new Error(
        `${
          error instanceof Error ? error.message : String(error)
        } error while gettign Time Slots in mentee service`
      );
    }
  }
}
