import { ImentorApplyData } from "../../Types";
import { Icategory } from "../../Model/categorySchema";
import { Imentee } from "../../Model/menteeModel";

export default interface IauthService {

  mentee_Signup(
    userData: Imentee
  ): Promise<{ success: boolean; message: string }>;
  mainLogin(email: string, password: string): Promise<{ success: boolean, message: string, refreshToken?: string, accessToken?: string, role?: string }>
  forgotPassword(email: string): Promise<{ success: boolean, message: string } | undefined>;
  forgot_PasswordChange(email: string, password: string): Promise<{ success: boolean, message: string } | undefined>

  adminLogin(email: string, password: string): Promise<{ success: boolean, message: string, accessToken?: string, refreshToken?: string } | undefined>
  mentorFields(): Promise<{ success: boolean, message: string, status: number, categories?: Icategory[] }>
  mentorApply(mentorData: ImentorApplyData): Promise<{ success: boolean, message: string, status: number }>;
  mentorLogin(email: string, password: string): Promise<{ success: boolean, message: string, status: number, refreshToken?: string, accessToken?: string }>;
  mentorForgot_PasswordChange(email: string, password: string): Promise<{ success: boolean; message: string } | undefined>;
  mentorForgotPassword(email: string): Promise<{ success: boolean; message: string } | undefined>


  googleAuth(user:Imentee|undefined): Promise<{ success: boolean, message: string,status:number,accessToken?:string ,refreshToken?:string}>
}
