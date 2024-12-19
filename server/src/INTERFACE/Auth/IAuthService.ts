import { IMentee } from "../../MODEL/MenteeModel";

export default interface IAuthService {
  mentee_Signup(
    userData: IMentee
  ): Promise<{ success: boolean; message: string }>;
  BLMainLogin(email:string,password:string):Promise<{success:boolean,message:string,refreshToken?:string,accessToken?:string}>
  BLforgotPassword(email:string,userType:string):Promise<{success:boolean,message:string}|undefined>;
  BLforgot_PasswordChange(email:string,password:string):Promise<{success:boolean,message:string}|undefined>


  BLAccessToken(refreshToken:string):Promise<{success:boolean,message:string,accessToken?:string,refreshToken?:string}>
  
}
