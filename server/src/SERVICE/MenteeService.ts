import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import { IMenteeService } from "../INTERFACE/Mentee/IMenteeService";
import { IMentee } from "../MODEL/MenteeModel";
import { IMenteeRepository } from "../INTERFACE/Mentee/IMenteeRepository";
import hash_pass from "../UTILS/hashPass.util";
import { uploadImage } from "../CONFIG/cloudinary.util";
import { genAccesssToken, genRefreshToken, verifyRefreshToken } from "../UTILS/jwt.utils";
import { IMentor } from "../MODEL/mentorModel";
import { IMentorRepository } from "../INTERFACE/Mentor/IMentorRepository";
import { ICategoryRepository } from "../INTERFACE/Category/ICategoryRepository";

export class MenteeService implements IMenteeService {
  constructor(
    private _menteeRepository: IMenteeRepository,
    private _mentorRespository: IMentorRepository,
    private _categoryRepository:ICategoryRepository
  ) { }

  async blMenteeProfile(refreshToken: string): Promise<{ success: boolean, message: string, result: IMentee | null, status: number }> {
    try {

      const decode = jwt.verify(
        refreshToken,
        process.env?.JWT_ACCESS_SECRET as string
      ) as { userId: string };

      if (!decode) {
        return { success: false, message: "Your session has expired. Please log in again.", status: 403, result: null };
      }

      console.log(decode, decode.userId)
      const result = await this._menteeRepository.dbFindById(decode.userId);
      if (!result) {
        return { success: false, message: "invalid credential", status: 403, result: null }
      }

      return { success: true, message: "success", result: result, status: 200 }
    } catch (error: unknown) {
      throw new Error(
        `Error while bl metneeProfile in service: ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async blEditMenteeProfile(formData: Partial<IMentee>): Promise<{ success: boolean; message: string; result: IMentee | null; status: number; }> {
    try {
      console.log(formData)
      if (!formData) {
        return { success: false, message: "credential is  missing", status: 400, result: null };
      }

      const result = await this._menteeRepository.dbEditMentee(
        formData
      );

      console.log(result, "this is edit mentee result");
      if (!result) {
        return { success: false, message: "mentee not found", status: 401, result: null };
      }
      return { success: true, message: 'edit successfully', status: 200, result: result }
    } catch (error: unknown) {
      throw new Error(
        `Error while bl metneeProfile edit in service: ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  //metnee profile pass chagne

  async blPasswordChange(currentPassword: string, newPassword: string, _id: string): Promise<{ success: boolean; message: string; status: number; }> {
    try {
      if (!currentPassword || !newPassword || !_id) {
        return { success: false, message: "credentials not found", status: 400 };
      }
      if (currentPassword == newPassword) {
        return { success: false, message: "new password cannto be same as current password", status: 401 };
      }
      const result = await this._menteeRepository.dbFindById(_id);
      if (!result) {
        return { success: false, message: "invalid credential ", status: 401 };
      }

      const passCompare = await bcrypt.compare(currentPassword, `${result?.password}`);
      if (!passCompare) {
        return { success: false, message: "incorrect current  password", status: 401 };
      }
      const hashPass = await hash_pass(newPassword);
      const response = await this._menteeRepository.dbChangePassword(_id, hashPass);
      if (!response) {
        return { success: false, message: "updation failed", status: 503 };
      }
      return { success: true, message: "updation successfull", status: 200 };

    } catch (error: unknown) {
      throw new Error(
        `Error while bl metneeProfile password change in service: ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async blProfileChange(image: Express.Multer.File | null, id: string): Promise<{ success: boolean; message: string; status: number; profileUrl?: string }> {
    try {
      if (!image || !id) {
        return { success: false, message: "credential not found", status: 400 };
      }
      const profileUrl = await uploadImage(image?.buffer);
      console.log(profileUrl)
      const result = await this._menteeRepository.dbProfileChange(profileUrl, id);

      if (!result) {
        return { success: false, message: "user not found", status: 401 };
      }
      return { success: true, message: "updation successfull", status: 200, profileUrl: result.profileUrl };
    } catch (error: unknown) {
      throw new Error(
        `Error while bl metnee Profile  change in service: ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async BLRefreshToken(refresh: string): Promise<{
    success: boolean;
    message: string;
    status: number;
    accessToken?: string;
    refreshToken?: string;
  }> {
    try {

      if (!refresh) {
        return { success: false, message: "RefreshToken missing", status: 403 };
      }

      const decode = verifyRefreshToken(refresh);
      if (decode) {
        console.log(decode.userId); // Assuming userId is part of the JWT payload
      }
      if (!decode) {
        return { success: false, message: "Your session has expired. Please log in again.", status: 403 };

      }
      console.log(decode, 'thsi is verifyRefreshToken')
      let { userId } = decode;


      const accessToken: string | undefined = genAccesssToken(userId as string)


      const refreshToken: string | undefined = genRefreshToken(userId as string)

      return {
        success: true,
        message: "Token refresh successfully",
        accessToken,
        refreshToken,
        status: 200
      };
    } catch (error: unknown) {
      console.error("Error while generating access or refresh token:", error);
      return { success: false, message: "Internal server error", status: 500 };
    }
  }
  async blExploreData(): Promise<{ success: boolean; message: string; status: number; mentor?: IMentor | null; category?: ICategory | null; }> {
    try {
      const mentorData = await this._mentorRespository.dbFindAllMentor();
      if(!mentorData){
        return { success: false, message:"Data not found", status:404 };
      }
      const categoryData =await this._categoryRepository.dbcategoryData();
      if(!categoryData){
        return { success: false, message:"Data not found", status:404 };
      }
      } catch (error: unknown) {
      console.error("Error while generating access or refresh token:", error);
      return { success: false, message: "Internal server error", status: 500 };
    }
  }
}

