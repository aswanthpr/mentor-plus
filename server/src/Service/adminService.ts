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
import { Status } from "../Constants/httpStatusCode";
import { IslotScheduleRepository } from "../Interface/Booking/iSlotScheduleRepository";
import { IcardData } from "../Types";
import { createSkip } from "../Utils/reusable.util";
import { HttpResponse } from "../Constants/httpResponse";
import { HttpError } from "../Utils/http-error-handler.util";

export class adminService implements IadminService {
  constructor(
    private readonly _categoryRepository: IcategoryRepository,
    private readonly _menteeRepository: ImenteeRepository,
    private readonly _mentorRepository: ImentorRepository,
    private readonly _notificationRepository: InotificationRepository,
    private readonly _slotScheduleRepository: IslotScheduleRepository,
  ) { }

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
        return { success: false, message: HttpResponse?.NO_TOKEN, status: Status?.Unauthorized };
      }
      const decode = verifyRefreshToken(refresh, "admin");

      if (
        !decode?.isValid ||
        !decode?.result?.userId ||
        decode?.error == "TamperedToken" ||
        decode?.error == "TokenExpired"
      ) {
        return {
          success: false,
          message: HttpResponse?.UNAUTHORIZED,
          status: Status?.Unauthorized,
        };
      }

      const userId = decode?.result?.userId;

      const accessToken: string | undefined = genAccesssToken(userId as string, "admin");

      const refreshToken: string | undefined = genRefreshToken(
        userId as string, "admin"
      );

      return {
        success: true,
        message: HttpResponse?.TOKEN_GENERATED,
        accessToken,
        refreshToken,
        status: Status?.Ok,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
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
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status?.BadRequest,
        };
      }
      const result = await this._categoryRepository.findCategory(category);

      if (result) {
        return { success: false, message: HttpResponse?.CATEOGRY_EXIST, status: Status?.Conflict };
      }
      const response = await this._categoryRepository.createCategory(
        category
      );

      if (response?.category != category) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status?.Conflict,
        };
      }
      return {
        success: true,
        message: HttpResponse?.CATEGORY_CREATED,
        result: response,
        status: Status?.Created,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
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
    status: number;
    totalPage: number;
  }> {
    try {
      if (!sortField || !statusFilter || !sortOrder || page < 1 || limit < 1) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status.BadRequest,
          categories: [],
          totalPage: 0,
        };
      }
      const skipData = createSkip(page, limit);

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
          message: HttpResponse?.CATEGORY_NOTFOUND,
          status: Status.BadRequest,
          categories: [],
          totalPage: 0,
        }
      }
      const totalPage = Math.ceil(result?.totalDoc / limitNo);

      return {
        success: true,
        message: HttpResponse?.DATA_RETRIEVED,
        status: Status.Ok,
        categories: result?.category,
        totalPage
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
  //category edit controll
  async editCategory(
    id: string,
    category: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (!category || !id) {
        return { success: false, message: HttpResponse?.INVALID_CREDENTIALS };
      }

      const resp = await this._categoryRepository.findCategory(category);
      console.log(resp, "thsi is resp");
      if (resp) {
        return { success: false, message: HttpResponse?.CATEOGRY_EXIST };
      }

      const result = await this._categoryRepository.editCategory(
        id,
        category
      );

      if (!result) {
        return { success: false, message: HttpResponse?.CATEGORY_NOTFOUND };
      }
      return { success: true, message: HttpResponse?.CATEGORY_EDITED };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
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
        return { success: false, message: HttpResponse?.CATEGORY_NOTFOUND, status: Status?.BadRequest };
      }
      return {
        success: true,
        message: HttpResponse?.CATEGORY_EDITED,
        status: Status?.Ok,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }

  async menteeData(
    search: string,
    sortField: string,
    sortOrder: string,
    statusFilter: string,
    page: number,
    limit: number,): Promise<{
      success: boolean;
      message: string;
      status: number;
      Data?: Imentee[] | [];
      totalPage: number
    }> {
    try {
      if (!sortField || !statusFilter || !sortOrder || page < 1 || limit < 1) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status.BadRequest,
          Data: [],
          totalPage: 0,
        };
      }
      const pageNo = Math.max(page, 1);
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
        return {
          success: false,
          message: HttpResponse?.USER_NOT_FOUND,
          status: Status?.BadRequest,
          totalPage: 0,
          Data: []
        };
      }
      const totalPage = Math.ceil(result?.totalDoc / limitNo)
      return {
        success: true,
        message: HttpResponse?.DATA_RETRIEVED,
        status: Status?.Ok,
        Data: result?.mentees,
        totalPage,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
  async changeMenteeStatus(
    id: string
  ): Promise<{ success: boolean; message: string; status: number }> {
    try {
      if (!id) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status?.BadRequest,
        };
      }
      const result = await this._menteeRepository.changeMenteeStatus(id);
      if (!result) {
        return { success: false, message: HttpResponse?.USER_NOT_FOUND, status: Status?.BadRequest };
      }
      return {
        success: true,
        message: HttpResponse?.CHANGES_APPLIED,
        status: Status?.Ok,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }

  async editMentee(
    formData: Partial<Imentee>
  ): Promise<{ success: boolean; message: string; status?: number }> {
    try {
      console.log(formData);
      if (!formData) {
        return { success: false, message: HttpResponse?.INVALID_CREDENTIALS };
      }

      const result = await this._menteeRepository.editMentee(formData);

      if (!result) {
        return { success: false, message: HttpResponse?.USER_NOT_FOUND };
      }
      return {
        success: true,
        message: HttpResponse?.CHANGES_APPLIED,
        status: Status?.Ok,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
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
        return { success: false, message: HttpResponse?.INVALID_CREDENTIALS };
      }
      const result = await this._menteeRepository.findMentee(email);

      if (result) {
        return { success: false, message: HttpResponse?.EMAIL_EXIST };
      }
      const response = await this._menteeRepository.addMentee(formData);

      return {
        success: true,
        message: HttpResponse?.USER_CREATION_SUCCESS,
        status: Status?.Ok,
        mentee: response,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }

  //mentormanagement
  async mentorData(
    search: string,
    activeTab: string,
    sortField: string,
    sortOrder: string,
    page: number,
    limit: number
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    mentorData: Imentor[] | [];
    totalPage: number;
  }> {
    try {

      if (!activeTab || !sortField || !sortOrder || 1 > page || 1 > limit) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status.BadRequest,
          mentorData: [],
          totalPage: 0
        };
      }

      const pageNo = Math.max(page, 1);
      const limitNo = Math.max(limit, 1);
      const skip = (pageNo - 1) * limitNo;

      const result = await this._mentorRepository.findAllMentor(
        skip,
        limitNo,
        activeTab,
        search,
        sortField,
        sortOrder,
      );
      const totalPage = Math.ceil(result?.totalDoc / limitNo);
      console.log(result, totalPage)
      if (!result) {
        return {
          success: false,
          message: HttpResponse?.RESOURCE_NOT_FOUND,
          status: Status?.NoContent,
          mentorData: [],
          totalPage: 0
        };
      }
      return {
        success: true,
        message: HttpResponse?.DATA_RETRIEVED,
        status: Status?.Ok,
        mentorData: result?.mentors,
        totalPage
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
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
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status?.BadRequest,
          result: null,
        };
      }

      const mentorId = new mongoose.Types.ObjectId(id);
      const response = await this._mentorRepository.verifyMentor(mentorId);

      if (!response) {
        return {
          success: false,
          message: HttpResponse?.USER_NOT_FOUND,
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
        message: HttpResponse?.USER_VERIFIED,
        status: Status?.Ok,
        result: response,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
  //mentor status change logic
  async mentorStatusChange(
    id: string
  ): Promise<{ success: boolean; message: string; status: number }> {
    try {
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return { success: false, message: HttpResponse?.INVALID_CREDENTIALS, status: Status?.BadRequest };
      }
      const mentorId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id);
      const result = await this._mentorRepository.changeMentorStatus(
        mentorId
      );
      if (!result) {
        return {
          success: false,
          message: HttpResponse?.RESOURCE_UPDATE_FAILED,
          status: Status?.BadRequest,
        };
      }
      return {
        success: true,
        message: HttpResponse?.RESOURCE_UPDATED,
        status: Status?.Ok,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }

  async dashboardData(timeRange: string): Promise<{ message: string; success: boolean; status: number; salesData: IcardData | null }> {
    try {
      const platformCommision = Number(process.env.PLATFORM_COMMISION as string);

      const salesData = await this._slotScheduleRepository.mentorDashboard(platformCommision, timeRange);
      return {
        message: HttpResponse?.DATA_RETRIEVED,
        success: true,
        status: Status.Ok,
        salesData,
      }
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
}
