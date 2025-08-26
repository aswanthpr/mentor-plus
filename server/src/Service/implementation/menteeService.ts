import bcrypt from "bcrypt";

import { Imentee } from "../../Model/menteeModel";
import {
  genAccesssToken,
  genRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hash_pass,
  HttpError
} from "../../Utils/index";

import { Imentor } from "../../Model/mentorModel";
import { Status } from "../../Constants/httpStatusCode";
import { Iquestion } from "../../Model/questionModal";
import { Icategory } from "../../Model/categorySchema";
import { uploadImage } from "../../Config/cloudinary.config";
import { ImenteeService } from "../interface/iMenteeService";
import { IcategoryRepository } from "../../Repository/interface/iCategoryRepository";
import { ImentorRepository } from "../../Repository/interface/iMentorRepository";
import { IquestionRepository } from "../../Repository/interface/IquestionRepository";
import { ImenteeRepository } from "../../Repository/interface/iMenteeRepository";
import { PipelineStage } from "mongoose";
import { HttpResponse } from "../../Constants/httpResponse";
import { MentorDTO } from "../../dto/mentor/mentorDTO";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export class menteeService implements ImenteeService {
  constructor(
    private _menteeRepository: ImenteeRepository,
    private _mentorRepository: ImentorRepository,
    private _categoryRepository: IcategoryRepository,
    private _questionRepository: IquestionRepository
  ) { }

  async menteeProfile(refreshToken: string): Promise<{
    success: boolean;
    message: string;
    result: Imentee | null;
    status: number;
  }> {
    try {
      const decode = verifyAccessToken(refreshToken, 'mentee')


      if (!decode?.result?.userId) {
        return {
          success: false,
          message: HttpResponse?.TOKEN_EXPIRED,
          status: Status?.Forbidden,
          result: null,
        };
      }

      const result = await this._menteeRepository.findById(decode?.result?.userId);
      if (!result) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status?.BadRequest,
          result: null,
        };
      }

      return { success: true, message: "success", result: result, status: Status?.Ok };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
  async editMenteeProfile(formData: Partial<Imentee>): Promise<{
    success: boolean;
    message: string;
    result: Imentee | null;
    status: number;
  }> {
    try {

      if (!formData) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status.BadRequest,
          result: null,
        };
      }

      const result = await this._menteeRepository.editMentee(formData);

   
      if (!result) {
        return {
          success: false,
          message: HttpResponse?.USER_NOT_FOUND,
          status: Status?.NotFound,
          result: null,
        };
      }
      return {
        success: true,
        message: HttpResponse?.SUCCESS,
        status: Status.Ok,
        result: result,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
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
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status.BadRequest,
        };
      }
      if (currentPassword == newPassword) {
        return {
          success: false,
          message: HttpResponse?.NEW_PASS_REQUIRED,
          status: Status?.BadRequest,
        };
      }
      const result = await this._menteeRepository.findById(_id);
      if (!result) {
        return { success: false, message: HttpResponse?.INVALID_CREDENTIALS, status: Status?.NotFound };
      }

      const passCompare = await bcrypt.compare(
        currentPassword,
        `${result?.password}`
      );
      if (!passCompare) {
        return {
          success: false,
          message: HttpResponse?.PASSWORD_INCORRECT,
          status: Status?.BadRequest,
        };
      }
      const hashPass = await hash_pass(newPassword);
      const response = await this._menteeRepository.changePassword(
        _id,
        hashPass
      );
      if (!response) {
        return { success: false, message: HttpResponse?.RESOURCE_UPDATE_FAILED, status: Status?.BadRequest };
      }
      return { success: true, message: HttpResponse?.SUCCESS, status: Status?.Ok };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
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
        return { success: false, message: HttpResponse?.INVALID_CREDENTIALS, status: Status?.BadRequest };
      }
      const profileUrl = await uploadImage(image?.buffer);

      const result = await this._menteeRepository.profileChange(profileUrl, id);

      if (!result) {
        return { success: false, message: HttpResponse?.USER_NOT_FOUND, status: Status?.BadRequest };
      }
      return {
        success: true,
        message: HttpResponse?.SUCCESS,
        status: Status.Ok,
        profileUrl: result.profileUrl,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
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
        return {
          success: false,
          message: HttpResponse?.UNAUTHORIZED,
          status: Status?.Unauthorized,
        };
      }

      const decode = verifyRefreshToken(refresh, "mentee");
     
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

      const accessToken: string | undefined = genAccesssToken(
        userId as string,
        "mentee"
      );

      const refreshToken: string | undefined = genRefreshToken(
        userId as string,
        "mentee"
      );

      return {
        success: true,
        message: HttpResponse?.TOKEN_GENERATED,
        accessToken,
        refreshToken,
        status: Status.Ok,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }

  //metnor data fetching for explore
  async exploreData(params: {
    search: string | undefined;
    categories: string[] | [];
    skill: string[] | [];
    page: string;
    limit: string;
    sort: string;
  }): Promise<{
    success: boolean;
    message: string;
    status: number;
    mentor?: MentorDTO[]| null;
    category?: Icategory[] | null;
    skills: Imentor[] | undefined;
    currentPage?: number;
    totalPage?: number;
  }> {
    try {
      const { search, categories, skill, page, limit, sort } = params;

      const pageNo = parseInt(page, 10) || 1;
      const limitNo = parseInt(limit, 10) || 1;
      const skip = (pageNo - 1) * limitNo;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const matchStage: any = { verified: true };

      if (search) {
        matchStage.$or = [
          { name: { $regex: search, $options: "i" } },
          { bio: { $regex: search, $options: "i" } },
          { jobTitle: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
          { skills: { $in: [new RegExp(search, "i")] } },
        ];
      }
      if (categories && categories.length > 0) {
        matchStage.category = { $in: categories };
      }
      if (skill && skill.length > 0) {
        matchStage.skills = { $in: skill };
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sortStage: any = {};
      if (sort === "A-Z") {
        sortStage["name"] = 1; // Sort by name (ascending)
      } else if (sort === "Z-A") {
        sortStage["name"] = -1; // Sort by name (descending)
      } else {
        sortStage["createdAt"] = -1; // Default sorting: latest first
      }
      const aggregationPipeline: PipelineStage[] = [
        { $match: matchStage },

        // Lookup reviews for each mentor
        {
          $lookup: {
            from: "reviews",
            localField: "_id",
            foreignField: "mentorId",
            as: "reviews",
          },
        },

        // Lookup mentee details for each review
        {
          $lookup: {
            from: "mentees",
            localField: "reviews.menteeId",
            foreignField: "_id",
            as: "mentees",
          },
        },

        // Process each review to attach the corresponding mentee
        {
          $addFields: {
            reviews: {
              $map: {
                input: "$reviews",
                as: "review",
                in: {
                  $mergeObjects: [
                    "$$review",
                    {
                      mentee: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$mentees",
                              as: "mentee",
                              cond: {
                                $eq: ["$$mentee._id", "$$review.menteeId"],
                              },
                            },
                          },
                          0,
                        ],
                      },
                    },
                  ],
                },
              },
            },
          },
        },

        // Compute the average rating
        {
          $addFields: {
            averageRating: { $avg: "$reviews.rating" },
          },
        },

        // Remove extra mentees array
        {
          $project: {
            mentees: 0,
          },
        },

        { $sort: sortStage },
        { $skip: skip },
        { $limit: limitNo },
      ];

      const mentorData = await this._mentorRepository.findVerifiedMentor(
        aggregationPipeline
      );
     
      if (!mentorData) {
        return {
          success: false,
          message: HttpResponse?.RESOURCE_NOT_FOUND,
          status: Status.NotFound,
          skills: undefined,
        };
      }
      //calculating total pages
      const totalPage = Math.ceil(mentorData?.count / limitNo);
      //finding categoryData
      const categoryData = await this._categoryRepository.allCategoryData();
      if (!categoryData) {
        return {
          success: false,
          message: HttpResponse?.RESOURCE_NOT_FOUND,
          status: Status.NotFound,
          skills: undefined,
        };
      }

      // finding skills
      const categoryWithSkill =
        await this._mentorRepository.categoryWithSkills();
//dto mapping 
      const mentorDto = MentorDTO.multiple(mentorData?.mentor as Imentor[])

      return {
        success: false,
        message: HttpResponse?.RESOURCE_FOUND,
        status: Status.Ok,
        mentor: mentorDto,
        category: categoryData,
        skills: categoryWithSkill,
        totalPage,
        currentPage: pageNo,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
  //this is for getting mentee home question data
  async homeData(
    filter: string,
    search: string,
    sortField: string,
    sortOrder: string,
    page: number,
    limit: number
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    homeData: Iquestion[] | [];
    totalPage: number;
  }> {
    try {
     
      if (!filter || page < 1 || limit < 1 || !sortField || !sortOrder) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status.BadRequest,
          homeData: [],
          totalPage: 0,
        };
      }

      const pageNo = page || 1;
      const limitNo = limit || 6;
      const skip = (pageNo - 1) * limitNo;

      const response = await this._questionRepository.allQuestionData(
        filter,
        search,
        sortOrder,
        sortField,
        skip,
        limit
      );
      if (!response) {
        return {
          success: false,
          message: HttpResponse?.RESOURCE_NOT_FOUND,
          status: Status.NotFound,
          homeData: [],
          totalPage: 0,
        };
      }
      const totalPage = Math.ceil(response?.count / limitNo);
      return {
        success: true,
        message: HttpResponse?.DATA_RETRIEVED,
        status: Status.Ok,
        homeData: response?.question,
        totalPage,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
  // /mentee/explor/mentor/:id
  async getMentorDetailes(
    category: string,
    mentorId: string
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
          message: HttpResponse?.INVALID_CREDENTIALS,
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
          message: HttpResponse?.RESOURCE_NOT_FOUND,
          success: false,
          mentor: [],
        };
      }
      return {
        status: Status.Ok,
        message: HttpResponse?.DATA_RETRIEVED,
        success: true,
        mentor: response,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
}
