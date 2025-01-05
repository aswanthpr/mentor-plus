import { ICategory } from "../../MODEL/categorySchema";
import { IMentee } from "../../MODEL/MenteeModel";
import { IMentor } from "../../MODEL/mentorModel";
import { IMentorApplyData } from "../../TYPES/index";

export default interface IAuthService {

  mentee_Signup(
    userData: IMentee
  ): Promise<{ success: boolean; message: string }>;
  BLMainLogin(email: string, password: string): Promise<{ success: boolean, message: string, refreshToken?: string, accessToken?: string, role?: string }>
  BLforgotPassword(email: string): Promise<{ success: boolean, message: string } | undefined>;
  BLforgot_PasswordChange(email: string, password: string): Promise<{ success: boolean, message: string } | undefined>

  BLadminLogin(email: string, password: string): Promise<{ success: boolean, message: string, accessToken?: string, refreshToken?: string } | undefined>
  blMentorFields(): Promise<{ success: boolean, message: string, status: number, categories?: ICategory[] }>
  blMentorApply(mentorData: IMentorApplyData): Promise<{ success: boolean, message: string, status: number }>;
  blMentorLogin(email: string, password: string): Promise<{ success: boolean, message: string, status: number, refreshToken?: string, accessToken?: string }>;
  blMentorForgot_PasswordChange(email: string, password: string): Promise<{ success: boolean; message: string } | undefined>;
  blMentorForgotPassword(email: string): Promise<{ success: boolean; message: string } | undefined>


  blGoogleAuth(user:any|undefined): Promise<{ success: boolean, message: string,status:number,accessToken?:string ,refreshToken?:string}>
}
