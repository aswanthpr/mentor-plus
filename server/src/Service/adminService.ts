import mongoose, { ObjectId } from "mongoose";
import { Imentor } from "../Model/mentorModel";
import { Imentee } from "../Model/menteeModel";
import { Icategory } from "../Model/categorySchema";
import { IadminService } from "../Interface/Admin/iAdminService";
import { IcategoryRepository } from "../Interface/Category/iCategoryRepository"; 
import { ImenteeRepository } from "../Interface/Mentee/iMenteeRepository";
import { ImentorRepository } from "../Interface/Mentor/iMentorRepository"; 
import {
  genAccesssToken,
  genRefreshToken,
  verifyRefreshToken,
} from "../Utils/jwt.utils";
import { InotificationRepository } from "../Interface/Notification/InotificationRepository";
import { Status } from "../Utils/httpStatusCode";
import { IslotScheduleRepository } from "../Interface/Booking/iSlotScheduleRepository";
import { IcardData } from "../Types";
import { createSkip } from "../Utils/reusable.util";

export class adminService implements IadminService {
  constructor(
    private readonly _categoryRepository: IcategoryRepository,
    private readonly _menteeRepository: ImenteeRepository,
    private readonly _mentorRepository: ImentorRepository,
    private readonly _notificationRepository:InotificationRepository,
    private readonly _slotScheduleRepository:IslotScheduleRepository,
  ) {}

  async adminRefreshToken(refresh: string): Promise<{
    success: boolean;
    message: string;
    status: number;
    accessToken?: string;
    refreshToken?: string; 
  }> {
    try {
      console.log(refresh, "thsi is admin refrsh");
      if (!refresh) {
        return { success: false, message: "RefreshToken missing", status: Status?.Unauthorized };
      }
      const decode = verifyRefreshToken(refresh,"admin");

      if (
        !decode?.isValid ||
        !decode?.result?.userId ||
        decode?.error == "TamperedToken" ||
        decode?.error == "TokenExpired"
      ) {
        return {
          success: false,
          message: "You are not authorized. Please log in.",
          status: Status?.Unauthorized,
        };
      }
      
      const userId  = decode?.result?.userId;

      const accessToken: string | undefined = genAccesssToken(userId as string,"admin");

      const refreshToken: string | undefined = genRefreshToken(
        userId as string,"admin"
      );

      return {
        success: true,
        message: "Token refresh successfully",
        accessToken,
        refreshToken,
        status: Status?.Ok,
      };
    } catch (error: unknown) {
      console.error("Error while generating access or refresh token:", error);
      return { success: false, message: "Internal server error", status: Status?.InternalServerError };
    }
  }
  async createCategory(Data: {
    category: string;
  }): Promise<{
    success: boolean;
    message: string;
    result?: Icategory;
    status: number;
  }> {
    try {
      const { category } = Data;
      if (!category) {
        return {
          success: false,
          message: "input data is missing",
          status: Status?.BadRequest,
        };
      }
      const result = await this._categoryRepository.findCategory(category);

      if (result) {
        return { success: false, message: "category is existing", status: Status?.Conflict };
      }
      const response = await this._categoryRepository.createCategory(
        category
      );

      if (response?.category != category) {
        return {
          success: false,
          message: "unexpected error happend",
          status: Status?.Conflict,
        };
      }
      return {
        success: true,
        message: "category created successfully",
        result: response,
        status: Status?.Created,
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
  async categoryData(
    searchQuery: string,
    statusFilter: string,
    sortField: string,
    sortOrder: string,
    page: number,
    limit: number
  ): Promise<{
    success: boolean;
    message: string;
    categories?: Icategory[];
    status:number;
    totalPage:number;
  }> {
    try {
      if ( !sortField ||!statusFilter|| !sortOrder || page < 1 || limit < 1) {
        return {
          success: false,
          message: "Invalid pagination or missing parameters",
          status: Status.BadRequest,
          categories: [],
          totalPage: 0,
        };
      }
      const skipData = createSkip(page,limit);
      
      const limitNo = skipData?.limitNo;
      const skip = skipData?.skip
      const result = await this._categoryRepository.categoryData(
        searchQuery,
        statusFilter,
        sortField,
        sortOrder,
        skip,
        limitNo,
      );

      if (!result) {
        return {
        success: false,
        message: "No categories found",
        status: Status.BadRequest,
        categories: [],
        totalPage: 0,
        }
      }
      const totalPage = Math.ceil(result?.totalDoc/limitNo);

      return {
        success: true,
        message: "Data retrieved successfully",
        status: Status.Ok,
        categories: result?.category,
        totalPage
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
  async editCategory(
    id: string,
    category: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (!category || !id) {
        return { success: false, message: "credential is  missing" };
      }

      const resp = await this._categoryRepository.findCategory(category);
      console.log(resp, "thsi is resp");
      if (resp) {
        return { success: false, message: "category already exitst" };
      }

      const result = await this._categoryRepository.editCategory(
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

  async changeCategoryStatus(
    id: string
  ): Promise<{ success: boolean; message: string; status: number }> {
    try {
      if (!id) {
        return {
          success: false,
          message: "credential is missing",
          status: Status?.BadRequest,
        };
      }
      const result = await this._categoryRepository.changeCategoryStatus(id);
      if (!result) {
        return { success: false, message: "category not found", status: Status?.BadRequest };
      }
      return {
        success: true,
        message: "category Edited successfully",
        status: Status?.Ok,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error while change category status in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async menteeData(
    search:string,
    sortField:string,
    sortOrder:string,
    statusFilter:string,
    page:number,
    limit:number,): Promise<{
    success: boolean;
    message: string;
    status: number;
    Data?: Imentee[]|[];
    totalPage:number
  }> {
    try {
      if ( !sortField ||!statusFilter|| !sortOrder || page < 1 || limit < 1) {
        return {
          success: false,
          message: "Invalid pagination or missing parameters",
          status: Status.BadRequest,
          Data: [],
          totalPage: 0,
        };
      }
      const pageNo = Math.max(page,1);
      const limitNo = Math.max(limit, 1);
      const skip = (pageNo - 1) * limitNo;
      const result = await this._menteeRepository.menteeData(
        skip,
        limitNo,
        search,
        sortOrder,
        sortField,
        statusFilter,
      );

      if (!result) {
        return { success: false,
           message: "Users not  found",
            status: Status?.BadRequest ,
            totalPage:0,
            Data:[]
          };
      }
const totalPage = Math.ceil(result?.totalDoc/limitNo)
      return {
        success: true,
        message: "Data retrieved successfully",
        status: Status?.Ok,
        Data: result?.mentees,
        totalPage,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error while get mentee data in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async changeMenteeStatus(
    id: string
  ): Promise<{ success: boolean; message: string; status: number }> {
    try {
      if (!id) {
        return {
          success: false,
          message: "credential is missing",
          status:  Status?.BadRequest,
        };
      }
      const result = await this._menteeRepository.changeMenteeStatus(id);
      if (!result) {
        return { success: false, message: "mentee not found", status:  Status?.BadRequest };
      }
      return {
        success: true,
        message: "mentee Edited successfully",
        status:  Status?.Ok,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error while update  mentee status in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async editMentee(
    formData: Partial<Imentee>
  ): Promise<{ success: boolean; message: string; status?: number }> {
    try {
      console.log(formData);
      if (!formData) {
        return { success: false, message: "credential is  missing" };
      }

      const result = await this._menteeRepository.editMentee(formData);
      console.log(result, "this is edit mentee result");
      if (!result) {
        return { success: false, message: "mentee not found" };
      }
      return {
        success: true,
        message: "Mentee updated successfully!",
        status: Status?.Ok,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error while Edit  mentee data in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async addMentee(
    formData: Partial<Imentee>
  ): Promise<{
    success: boolean;
    message: string;
    status?: number;
    mentee?: Imentee | null;
  }> {
    try {
      const { name, email, phone, bio } = formData;
      if (!name || !email || !phone || !bio) {
        return { success: false, message: " credential is missing" };
      }
      const result = await this._menteeRepository.findMentee(email);

      if (result) {
        return { success: false, message: "email is existing" };
      }
      const response = await this._menteeRepository.addMentee(formData);

      return {
        success: true,
        message: "mentee added successfully",
        status: Status?.Ok,
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
  async mentorData(
    search:string,
    activeTab:string,
    sortField:string,
    sortOrder:string,
    page:number,
    limit:number
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    mentorData: Imentor[] | [];
    totalPage:number;
  }> {
    try {
      console.log(
        // skip,
        activeTab,
        limit,
        search,
        sortField,
        sortOrder,'jkbofiaaaaaaa')
      if(!activeTab||!sortField||!sortOrder||1>page||1>limit){
        return {
          success: false,
          message: 'Invalid pagination or missing parameters',
          status: Status.BadRequest,
          mentorData: [],
          totalPage: 0
        };
      }
   
      const pageNo = Math.max(page,1);
      const limitNo = Math.max(limit,1);
      const skip = (pageNo -1 ) * limitNo;
      
      const result = await this._mentorRepository.findAllMentor(
        skip,
        limitNo,
        activeTab,
        search,
        sortField,
        sortOrder,
      );
      const totalPage = Math.ceil(result?.totalDoc/limitNo);
      console.log(result,totalPage)
      if (!result) {
        return {
          success: false,
          message: "Data not found",
          status: Status?.NoContent,
          mentorData: [],
          totalPage:0
        };
      }
      return {
        success: true,
        message: "data successfully retrieved ",
        status: Status?.Ok,
        mentorData: result?.mentors,
        totalPage
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
  async mentorVerify(
    id: string
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    result: Imentor | null;
  }> {
    try {
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return {
          success: false,
          message: "invalid crdiential",
          status: Status?.BadRequest,
          result: null,
        };
      }

      const mentorId = new mongoose.Types.ObjectId(id);
      const response = await this._mentorRepository.verifyMentor(mentorId);

      if (!response) {
        return {
          success: false,
          message: "mentor not exist",
          status: Status?.Conflict,
          result: null,
        };
      }
       await this._notificationRepository.createNotification(
        mentorId as unknown as ObjectId,
        `Welcome ${response?.name}`,
        `Start exploring mentorPlus  and connect with mentees today.`,
        `mentor`,
        `${process.env.CLIENT_ORIGIN_URL}/mentor/schedule`,
      );

      return {
        success: true,
        message: "mentor verified Successfully!",
        status: Status?.Ok,
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
  async mentorStatusChange(
    id: string
  ): Promise<{ success: boolean; message: string; status: number }> {
    try {
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return { success: false, message: "invalid crdiential", status: Status?.BadRequest };
      }
      const mentorId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id);
      const result = await this._mentorRepository.changeMentorStatus(
        mentorId
      );
      if (!result) {
        return {
          success: false,
          message: "status updation failed!",
          status: Status?.BadRequest,
        };
      }
      return {
        success: true,
        message: "status updated successfully!",
        status: Status?.Ok,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error while change mentor status in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async dashboardData(timeRange:string): Promise<{ message: string; success: boolean; status: number;salesData:IcardData|null }> {
    try {
      const platformCommision = Number(process.env.PLATFORM_COMMISION as string);

      const salesData = await this._slotScheduleRepository.mentorDashboard(platformCommision,timeRange);
      return {
        message:"data successfuly recived",
        success:true,
        status:Status.Ok,
        salesData,
      }
    } catch (error:unknown) {
      throw new Error(
        `Error while change mentor status in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
