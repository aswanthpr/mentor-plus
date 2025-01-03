import { ICategoryRepository } from "../INTERFACE/Category/ICategoryRepository";
import { IAdminService } from "../INTERFACE/Admin/IAdminService";
import { ICategory } from "../MODEL/categorySchema";
import { IMenteeRepository } from "../INTERFACE/Mentee/IMenteeRepository";
import { IMentee } from "../MODEL/MenteeModel";
import { IMentor } from "../MODEL/mentorModel";
import { IMentorRepository } from "../INTERFACE/Mentor/IMentorRepository";
import mongoose, { ObjectId } from "mongoose";
import {
  genAccesssToken,
  genRefreshToken,
  verifyRefreshToken,
} from "../UTILS/jwt.utils";

export class AdminService implements IAdminService {
  constructor(
    private _CategoryRepository: ICategoryRepository,
    private _MenteeRepository: IMenteeRepository,
    private _MentorRepository: IMentorRepository
  ) {}

  async BLAdminRefreshToken(refresh: string): Promise<{
    success: boolean;
    message: string;
    status: number;
    accessToken?: string;
    refreshToken?: string;
  }> {
    try {
      console.log(refresh, "thsi is admin refrsh");
      if (!refresh) {
        return { success: false, message: "RefreshToken missing", status: 403 };
      }
      const decode = verifyRefreshToken(refresh);

      if (!decode) {
        return {
          success: false,
          message: "Your session has expired. Please log in again.",
          status: 403,
        };
      }
      console.log(decode, "thsi is verifyRefreshToken");
      let { userId } = decode;

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
  async blCreateCategory(Data: {
    category: string;
  }): Promise<{
    success: boolean;
    message: string;
    result?: ICategory;
    status: number;
  }> {
    try {
      const { category } = Data;
      if (!category) {
        return {
          success: false,
          message: "input data is missing",
          status: 400,
        };
      }
      const result = await this._CategoryRepository.dbFindCategory(category);

      if (result) {
        return { success: false, message: "category is existing", status: 409 };
      }
      const response = await this._CategoryRepository.dbCreateCategory(
        category
      );

      if (response?.category != category) {
        return {
          success: false,
          message: "unexpected error happend",
          status: 409,
        };
      }
      return {
        success: true,
        message: "category created successfully",
        result: response,
        status: 201,
      };
    } catch (error: unknown) {
      throw new Error(
        `error while create category in service ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  //get category data to admin
  async blCategoryData(): Promise<{
    success: boolean;
    message: string;
    categories?: ICategory[];
  }> {
    try {
      const result = await this._CategoryRepository.dbcategoryData();

      if (!result) {
        return { success: false, message: "No categories found" };
      }

      return {
        success: true,
        message: "Data retrieved successfully",
        categories: result,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error while getting category data in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  //category edit controll
  async blEditCategory(
    id: string,
    category: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (!category || !id) {
        return { success: false, message: "credential is  missing" };
      }

      const resp = await this._CategoryRepository.dbFindCategory(category);
      console.log(resp, "thsi is resp");
      if (resp) {
        return { success: false, message: "category already exitst" };
      }

      const result = await this._CategoryRepository.dbEditCategory(
        id,
        category
      );
      console.log(result, "this is edit categor result");
      if (!result) {
        return { success: false, message: "category not found" };
      }
      return { success: true, message: "category edited successfully" };
    } catch (error: unknown) {
      throw new Error(
        `Error while eding category  in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async blChangeCategoryStatus(
    id: string
  ): Promise<{ success: boolean; message: string; status: number }> {
    try {
      if (!id) {
        return {
          success: false,
          message: "credential is missing",
          status: 400,
        };
      }
      const result = await this._CategoryRepository.dbChangeCategoryStatus(id);
      if (!result) {
        return { success: false, message: "category not found", status: 400 };
      }
      return {
        success: true,
        message: "category Edited successfully",
        status: 200,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error while change category status in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async blMenteeData(): Promise<{
    success: boolean;
    message: string;
    status: number;
    Data?: IMentee[];
  }> {
    try {
      const result = await this._MenteeRepository.dbMenteeData();

      if (!result) {
        return { success: false, message: "Users not  found", status: 400 };
      }

      return {
        success: true,
        message: "Data retrieved successfully",
        status: 200,
        Data: result,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error while get mentee data in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async blChangeMenteeStatus(
    id: string
  ): Promise<{ success: boolean; message: string; status: number }> {
    try {
      if (!id) {
        return {
          success: false,
          message: "credential is missing",
          status: 400,
        };
      }
      const result = await this._MenteeRepository.dbChangeMenteeStatus(id);
      if (!result) {
        return { success: false, message: "mentee not found", status: 400 };
      }
      return {
        success: true,
        message: "mentee Edited successfully",
        status: 200,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error while update  mentee status in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async blEditMentee(
    formData: Partial<IMentee>
  ): Promise<{ success: boolean; message: string; status?: number }> {
    try {
      console.log(formData);
      if (!formData) {
        return { success: false, message: "credential is  missing" };
      }

      const result = await this._MenteeRepository.dbEditMentee(formData);
      console.log(result, "this is edit mentee result");
      if (!result) {
        return { success: false, message: "mentee not found" };
      }
      return {
        success: true,
        message: "Mentee updated successfully!",
        status: 200,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error while Edit  mentee data in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async blAddMentee(
    formData: Partial<IMentee>
  ): Promise<{
    success: boolean;
    message: string;
    status?: number;
    mentee?: IMentee | null;
  }> {
    try {
      const { name, email, phone, bio } = formData;
      if (!name || !email || !phone || !bio) {
        return { success: false, message: " credential is missing" };
      }
      const result = await this._MenteeRepository.dbFindMentee(email);

      if (result) {
        return { success: false, message: "email is existing" };
      }
      const response = await this._MenteeRepository.dbAddMentee(formData);

      return {
        success: true,
        message: "mentee added successfully",
        status: 200,
        mentee: response,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error while add  mentee data in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  //mentormanagement
  async blMentorData(): Promise<{
    success: boolean;
    message: string;
    status: number;
    mentorData: IMentor[] | [];
  }> {
    try {
      const result = await this._MentorRepository.dbFindAllMentor();
      if (!result) {
        return {
          success: false,
          message: "Data not found",
          status: 204,
          mentorData: [],
        };
      }
      return {
        success: true,
        message: "data successfully retrieved ",
        status: 200,
        mentorData: result,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error while add  mentor data in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  //herer  the mentor verification logic
  async blMentorVerify(
    id: string
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    result: IMentor | null;
  }> {
    try {
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return {
          success: false,
          message: "invalid crdiential",
          status: 400,
          result: null,
        };
      }

      const mentorId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id);
      const response = await this._MentorRepository.dbVerifyMentor(mentorId);

      if (!response) {
        return {
          success: false,
          message: "mentor not exist",
          status: 409,
          result: null,
        };
      }
      return {
        success: true,
        message: "mentor verified Successfully!",
        status: 200,
        result: response,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error while verify mentor in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  //mentor status change logic
  async blMentorStatusChange(
    id: string
  ): Promise<{ success: boolean; message: string; status: number }> {
    try {
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return { success: false, message: "invalid crdiential", status: 400 };
      }
      const mentorId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id);
      const result = await this._MentorRepository.dbChangeMentorStatus(
        mentorId
      );
      if (!result) {
        return {
          success: false,
          message: "status updation failed!",
          status: 400,
        };
      }
      return {
        success: true,
        message: "status updated successfully!",
        status: 200,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error while change mentor status in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
