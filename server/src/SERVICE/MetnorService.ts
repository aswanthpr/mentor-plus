import bcrypt from "bcrypt";
import { IMentorService } from "../INTERFACE/Mentor/IMentorService";
import { IMentorRepository } from "../INTERFACE/Mentor/IMentorRepository";
import { IMentor } from "../MODEL/mentorModel";
import jwt from "jsonwebtoken";
import {
  genAccesssToken,
  genRefreshToken,
  verifyRefreshToken,
} from "../UTILS/jwt.utils";
import { ICategoryRepository } from "../INTERFACE/Category/ICategoryRepository";
import { ICategory } from "../MODEL/categorySchema";
import hash_pass from "../UTILS/hashPass.util";
import { uploadImage } from "../CONFIG/cloudinary.util";

export class MentorService implements IMentorService {
  constructor(
    private _MentorRepository: IMentorRepository,
    private _CategoryRepository: ICategoryRepository
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
          message: "Invalid or expired refresh token.",
          status: 401,
        };
      }

      const decode = verifyRefreshToken(refresh);

      if (!decode || !decode.userId) {
        return {
          success: false,
          message: "Invalid or expired refresh token.",
          status: 401,
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
      console.error("Error while generating BLRefreshToken", error);
      return {
        success: false,
        message: "Invalid or expired refresh token",
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

  async blMentorProfileImageChange(image: Express.Multer.File | null, id: string): Promise<{ success: boolean; message: string; status: number; profileUrl?: string }> {
      try {
        if (!image || !id) {
          return { success: false,message: "Image or ID is missing, please provide both.", status: 400 };
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
        console.log(profileUrl)
        const result = await this._MentorRepository.dbChangeMentorProfileImage(profileUrl, id);
        console.log(result,'thsi is the result')
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
          `Error while bl metnee Profile  change in service: ${error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }

  // blMentorEditProfile(mentorData: IMentor):Promise<IMentor | null> {
  //   try {
  //     // {name,email,phone,jobTitle,category,linkedinUrl,githubUrl,bio,skills,resume,}=mentorData
  //   } catch (error:unknown) {
  //     throw new Error(
  //       `Error while  mentor Profile  edit details in service: ${error instanceof Error ? error.message : String(error)
  //       }`
  //     );
  //   }
  // }
}
