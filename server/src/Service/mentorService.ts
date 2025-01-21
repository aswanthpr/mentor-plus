import bcrypt from "bcrypt";
import { IMentorService } from "../Interface/Mentor/IMentorService";
import { IMentorRepository } from "../Interface/Mentor/IMentorRepository";
import { IMentor } from "../Model/mentorModel";
import jwt from "jsonwebtoken";
import {
  genAccesssToken,
  genRefreshToken,
  verifyRefreshToken,
} from "../Utils/jwt.utils";
import { ICategoryRepository } from "../Interface/Category/ICategoryRepository";
import { ICategory } from "../Model/categorySchema";
import hash_pass from "../Utils/hashPass.util";
import { uploadFile, uploadImage } from "../Config/cloudinary.util";
import { IquestionRepository } from "src/Interface/Qa/IquestionRepository";
import { Iquestion } from "src/Model/questionModal";

export class MentorService implements IMentorService {
  constructor(
    private _MentorRepository: IMentorRepository,
    private _CategoryRepository: ICategoryRepository,
    private _questionRepository:IquestionRepository,
  ) {}

  async blMentorProfile(token: string): Promise<{
    success: boolean;
    message: string;
    result: IMentor | null;
    status: number;
    categories: ICategory[] | [];
  }> {
    try {
      const decode = jwt.verify(
        token,
        process.env?.JWT_ACCESS_SECRET as string
      ) as { userId: string };

      if (!decode) {
        return {
          success: false,
          message: "Your session has expired. Please log in again.",
          status: 403,
          result: null,
          categories: [],
        };
      }

      console.log(decode, decode?.userId);
      const result = await this._MentorRepository.dbFindMentorById(
        decode?.userId
      );
      if (!result) {
        return {
          success: false,
          message: "invalid credential",
          status: 204,
          result: null,
          categories: [],
        };
      }
      const categoryData = await this._CategoryRepository.dbcategoryData();
      if (!categoryData) {
        return {
          success: false,
          message: "invalid credential",
          status: 204,
          result: null,
          categories: [],
        };
      }

      return {
        success: true,
        message: "successfull",
        status: 200,
        result: result,
        categories: categoryData,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error while bl metneeProfile in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  //mentor refresh token
  async blMentorRefreshToken(refresh: string): Promise<{
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
          message: "You are not authorized. Please log in.",
          status: 401,
        };
      }

      const decode = verifyRefreshToken(refresh);

      if (!decode || !decode.userId) {
        return {
          success: false,
          message: "You are not authorized. Please log in.",
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
      console.error("Error while generating BLRefreshToken", error);
      return {
        success: false,
        message: "An internal server error occurred. Please try again later.",
        status: 500,
      };
    }
  }
  //mentor password change logic
  async blPasswordChange(
    currentPassword: string,
    newPassword: string,
    id: string
  ): Promise<{ success: boolean; message: string; status: number }> {
    try {
      if (!currentPassword || !newPassword || !id) {
        return {
          success: false,
          message: "Please provide all required credentials.",
          status: 400,
        };
      }
      if (currentPassword == newPassword) {
        return {
          success: false,
          message: "New password cannot be the same as the current password.",
          status: 400,
        };
      }
      const result = await this._MentorRepository.dbFindMentorById(id);
      if (!result) {
        return {
          success: false,
          message: "User not found. Please check your credentials.",
          status: 404,
        };
      }

      const passCompare = await bcrypt.compare(
        currentPassword,
        `${result?.password}`
      );
      if (!passCompare) {
        return {
          success: false,
          message: "Incorrect current password. Please try again.",
          status: 401,
        };
      }
      const hashedPassword = await hash_pass(newPassword);
      const response = await this._MentorRepository.dbChangeMentorPassword(
        id,
        hashedPassword
      );

      if (!response) {
        return {
          success: false,
          message: "Failed to update the password. Please try again later.",
          status: 503,
        };
      }
      return {
        success: true,
        message: "Password updated successfully.",
        status: 200,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error during password change${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  //metnor profile image change

  async blMentorProfileImageChange(
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
        return {
          success: false,
          message: "Image or ID is missing, please provide both.",
          status: 400,
        };
      }
      const profileUrl = await uploadImage(image?.buffer);
      if (!profileUrl) {
        return {
          success: false,
          message: "Failed to upload the image, please try again later.",
          status: 500,
        };
      }
      // const currentPublicId = this.extractPublicIdFromCloudinaryUrl(currentProfile.profileUrl);

      // // If there's an existing image, delete it from Cloudinary
      // if (currentPublicId) {
      //   const deleteResult = await cloudinary.v2.uploader.destroy(currentPublicId);
      //   if (deleteResult.result !== 'ok') {
      //     return {
      //       success: false,
      //       message: "Failed to delete the old image from Cloudinary.",
      //       status: 500,
      //     };
      //   }
      // }
      console.log(profileUrl);
      const result = await this._MentorRepository.dbChangeMentorProfileImage(
        profileUrl,
        id
      );
      console.log(result, "thsi is the result");
      if (!result) {
        return {
          success: false,
          message: "Mentor not found with the provided ID.",
          status: 404,
        };
      }
      return {
        success: true,
        message: "Profile image updated successfully.",
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

  async blMentorEditProfile(
    mentorData: IMentor,
    resume: Express.Multer.File
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    result: IMentor | null;
  }> {
    try {

      const {
        _id,
        name,
        email,
        phone,
        jobTitle,
        category,
        linkedinUrl,
        githubUrl,
        bio,
        skills,
      } = mentorData;
      console.log("\x1b[32m%s\x1b[0m", _id, );

      if (
        !name ||
        !email ||
        !jobTitle ||
        !category ||
        !linkedinUrl ||
        !githubUrl ||
        !bio ||
        !skills
      ) {
        return {
          success: false,
          message: "credential is missing",
          status: 400,
          result: null,
        };
      }
      const existingMentor = await this._MentorRepository.dbFindMentorById(
        _id as string
      );
      console.log("sdfasifisoifjasojfoisjojd");

      if (!existingMentor) {
        return {
          success: false,
          message: "Mentor not existing",
          status: 404,
          result: null,
        };
      }
      const updatedData: Partial<IMentor> = {};
      if(existingMentor)updatedData.skills=skills;
      if (existingMentor._id )updatedData._id=existingMentor._id;
      if (existingMentor.name !== name) updatedData.name = name;
      if (existingMentor.email !== email) updatedData.email = email;
      if (existingMentor.phone !== phone) updatedData.phone = phone;
      if (existingMentor.jobTitle !== jobTitle) updatedData.jobTitle = jobTitle;
      if (existingMentor.category !== category) updatedData.category = category;
      if (existingMentor.linkedinUrl !== linkedinUrl)
        updatedData.linkedinUrl = linkedinUrl;
      if (existingMentor.githubUrl !== githubUrl)
        updatedData.githubUrl = githubUrl;
      if (existingMentor.bio !== bio) updatedData.bio = bio;

    
      if (resume) {
       const fileUrl = await uploadFile(resume.buffer, resume.originalname);
        if (!fileUrl) {
          throw new Error("Error while uploading resume");
        }
        updatedData.resume = fileUrl;
      } else {
        updatedData.resume = existingMentor.resume;
      }

      const result = await this._MentorRepository.dbUpdateMentorById(
        updatedData,
      );
  

      if (!result) {
        return {
          success: false,
          message: "unable to update",
          status: 404,
          result: null,
        };
      }
     
      return {
        success: true,
        message: "Details changed Successfully!",
        status: 200,
        result: result,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error while  mentor Profile  edit details in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async getHomeData(filter: string): Promise<{ success: boolean; message: string; status: number; homeData: Iquestion[] | null; }> {
    try {
      if(!filter){
        return {
          success: false,
          message: "credentials not found",
          status: 400,
          homeData:null
        };
      }

      const response = await this._questionRepository.allQuestionData(filter );
      console.log(response)
      return {
        success: true,
        message: "Data successfully fetched",
        status: 200,
        homeData: response,
      };
    } catch (error:unknown) {
      throw new Error(
        `Error while  mentor home data fetching in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
