import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { Imentee } from "../Model/menteeModel";
import {
  genAccesssToken,
  genRefreshToken,
  verifyRefreshToken,
} from "../Utils/jwt.utils"; 

import { Imentor } from "../Model/mentorModel";
import hash_pass from "../Utils/hashPass.util";
import { Status } from "../Utils/httpStatusCode";
import { Iquestion } from "../Model/questionModal";
import { Icategory } from "../Model/categorySchema";
import { uploadImage } from "../Config/cloudinary.util";
import { ImenteeService } from "../Interface/Mentee/iMenteeService";
import { IcategoryRepository } from "../Interface/Category/iCategoryRepository";
import { ImentorRepository } from "../Interface/Mentor/iMentorRepository";
import { IquestionRepository } from "../Interface/Qa/IquestionRepository";
import { ImenteeRepository } from "../Interface/Mentee/iMenteeRepository";
import { PipelineStage } from "mongoose";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export class menteeService implements ImenteeService {
  constructor(
    private _menteeRepository: ImenteeRepository,
    private _mentorRepository: ImentorRepository,
    private _categoryRepository: IcategoryRepository,
    private _questionRepository: IquestionRepository
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
          status: Status.BadRequest,
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
        status: Status.Ok,
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
          status: Status.BadRequest,
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
        status: Status.Ok,
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
          status: Status.NotFound,
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
        status: Status.Ok,
      };
    } catch (error: unknown) {
      console.error("Error while generating access or refresh token:", error);
      return { success: false, message: "Internal server error", status: 500 };
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
    mentor?: Imentor[] | null;
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
      console.log(mentorData, "mentordata");
      if (!mentorData) {
        return {
          success: false,
          message: "Data not found",
          status: Status.NotFound,
          skills: undefined,
        };
      }
      //calculating total pages
      const totalPage = Math.ceil(mentorData?.count / limitNo);
      //finding categoryData
      const categoryData = await this._categoryRepository.categoryData();
      if (!categoryData) {
        return {
          success: false,
          message: "Data not found",
          status: Status.NotFound,
          skills: undefined,
        };
      }

      // finding skills
      const categoryWithSkill =
        await this._mentorRepository.categoryWithSkills();

      return {
        success: false,
        message: "Data fetch successfully ",
        status: Status.Ok,
        mentor: mentorData?.mentor,
        category: categoryData,
        skills: categoryWithSkill,
        totalPage,
        currentPage: pageNo,
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
  //this is for getting mentee home question data
  async homeData(filter: string,search:string,page:number,limit:number): Promise<{
    success: boolean;
    message: string;
    status: number;
    homeData: Iquestion[] | [],
    totalPage:number
  }> {
    try {
      console.log(filter,search,page,limit)
      if (!filter||!page||!limit) {
        return {
          success: false,
          message: "credentials not found",
          status: Status.BadRequest,
          homeData: [],
          totalPage:0,
        };
      }

      const pageNo = page||1;
      const limitNo =limit || 6;
      const skip = (pageNo-1)*limitNo;
      
     

      const response = await this._questionRepository.allQuestionData(filter,search,skip,limit);
      if (!response) {
        return {
          success: false,
          message: "Data not found",
          status: Status.NotFound,
          homeData: [],
          totalPage:0,
        };
      }
      const totalPage = Math.ceil(response?.count/limitNo);
      return {
        success: true,
        message: "Data successfully fetched",
        status: Status.Ok,
        homeData: response?.question,
        totalPage,
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
        status: Status.InternalServerError,
        homeData: [],
        totalPage:0
      };
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
}
