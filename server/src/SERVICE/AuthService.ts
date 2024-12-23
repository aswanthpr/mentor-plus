import bcrypt from "bcrypt";
import { IAuthRepository } from "../INTERFACE/Auth/IAuthRepository";
import IAuthService from "../INTERFACE/Auth/IAuthService";
import { IMentee } from "../MODEL/MenteeModel";
import { genAccesssToken, genRefreshToken } from "../UTILS/jwt.utils";
import hash_pass from "../UTILS/hashPass.util";
import jwt from "jsonwebtoken";
import { nodeMailer } from "../UTILS/nodemailer.util";
import IOtpService from "../INTERFACE/Otp/IOtpService";

export class AuthService implements IAuthService {
  constructor(private _AuthRepository: IAuthRepository, private _OtpService:IOtpService) {}

  async mentee_Signup(
    userData: IMentee
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (!userData.email || !userData.password) {
        return { success: false, message: "Email or password is missing" };
      }
      const existingUser = await this._AuthRepository.findByEmail(
        userData.email
      );
      if (existingUser) {
        return {
          success: false,
          message: "user with this email is already exists",
        };
      }
      // pass hasing
      const hashPassword = await hash_pass(userData.password);
      userData.password = hashPassword;

      const newMentee = await this._AuthRepository.create_Mentee(userData);

      return { success: true, message: "signup successfull" };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("\x1b[35m%s\x1b[0m", "error while create mentee");
        throw new Error(`Failed to create  Mentee ${error.message}`);
      } else {
        console.log("An unknown error occured", error);
        throw error;
      }
    }
  }
  async BLMainLogin(email:string,password:string
  ): Promise<{
    success: boolean;
    message: string;
    refreshToken?: string;
    accessToken?: string;
  }> {
    try {
      console.log(email,password);
      

      console.log(email, password, "logic");
      if (!email || !password) {
        return { success: false, message: "login credencial is missing" };
      }
      const result = await this._AuthRepository.DBMainLogin(email);

      
      if (!result) {
        return { success: false, message: "user not exist.Please signup" };
      }
      if (result?.isAdmin) {
        return { success: false, message: "Admin is not allowed ,sorry.." };
      }
      if (result?.isBlocked) {
        return { success: false, message: "user blocked .sorry.." };
      }
      const checkUser = await bcrypt.compare(
        password,
        result?.password as string
      );

      if (!checkUser) {
        return { success: false, message: "password not matching" };
      }
      const userId: string = result._id as string;
      console.log(userId, "userid");
      const accessToken = genAccesssToken(userId as string);
      const refreshToken = genRefreshToken(userId as string);
      console.log(accessToken, refreshToken, "access refrsh");

      return {
        success: true,
        message: "Login Successfull",
        refreshToken,
        accessToken,
      };
    } catch (error: unknown) {
      throw new Error(
        `error in Login service ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  //forget password mentor and mentee;
  async BLforgotPassword(
    email: string,
    userType: string
  ): Promise<{ success: boolean; message:string }|
  undefined> {
    try {
      if (!email || !userType) {
        return { success: false, message: "credential is missing" };
       }

       if(userType=='mentee'){
        const result = await this._AuthRepository.findByEmail(email);
        if(!result||result?.isBlocked){
          return {success:false,message:'cannot find user'}
        }
         await this._OtpService.sentOtptoMail(email);
         return {success:true,message:'Otp success fully send to mail'}
       }

       // Handle unsupported user types.
    return { success: false, message: 'Invalid user type. Otp failed to send' };

    } catch (error: unknown) {
      console.log(
        `error while forget password in BLforgetPassword`,
        error instanceof Error ? error.message : String(error)
      );
    }
  }
  async BLforgot_PasswordChange(email:string,password:string):Promise<{success:boolean,message:string}|undefined>{
    try {

      if (!email || !password) {
        return { success: false, message: "credencial is missing" };
      }
        const hashedPassword:string = await  hash_pass(password) ;
      console.log(hashedPassword,'hash')
      const result = await this._AuthRepository.DBforgot_PasswordChange(email,hashedPassword);

      console.log(result,"ths is passchnge reslut");
      if (!result) {
        return { success: false, message: 'User does not exist. Please sign up.' };
      }
      
      return { success: true, message: 'password changed successfully.' };
    } catch (error:unknown) {
      console.log(
        `error while forget password in BLforgetPassword`,
        error instanceof Error ? error.message : String(error)
      );
      return { success: false, message: 'Internal server error' };
    }
  }
  async BLAccessToken(
    refreshToken: string
  ): Promise<{
    success: boolean;
    message: string;
    accessToken?: string;
    refreshToken?: string;
  }> {
    try {
      if (!refreshToken) {
        return { success: false, message: "RefreshToken missing" };
      }

      const decode = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      ) as { userId: string };

      if (!decode?.userId) {
        return { success: false, message: "Invalid token payload" };
      }
      let { userId } = decode;

      const userData = await this._AuthRepository.DBfindBy_id(userId);
      if (!userData) {
        return { success: false, message: "Invalid token payload" };
      }
      userId = userData?._id as string;

      const accessToken: string = jwt.sign(
        { userId: userId },
        process.env.JWT_ACCESS_SECRET as string,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
      );

      return {
        success: true,
        message: "Token refresh success fully",
        accessToken,
        refreshToken,
      };
    } catch (error: unknown) {
      console.error("Error while generating BLRefreshToken", error);
      return { success: false, message: "Invalid or expired refresh token" };
    }
  }

  //amdin login Logic

  async BLadminLogin(email: string, password: string):Promise<{success:boolean,message:string,accessToken?:string,refreshToken?:string}|undefined>{
    try {
      if (!email || !password) {
        return { success:false, message: "admin credencial is missing" };
      }
      const result = await this._AuthRepository.DBadminLogin(email);

      
      if (!result) {
        return { success: false, message: "Admin not exist" };
      }
      if (!result?.isAdmin) {
        return { success: false, message: "user is not allowed ,sorry.." };
      }
      if (result?.isBlocked) {
        return { success: false, message: "Admin blocked .sorry.." };
      }
      const checkUser = await bcrypt.compare( 
        password,
        result?.password as string
      );

      if (!checkUser) {
        return { success:false, message: "password not matching" };
      }
      const userId: string = result._id as string;
      console.log(userId, "userid");

      const accessToken = genAccesssToken(userId as string);
      const refreshToken = genRefreshToken(userId as string);
      console.log(accessToken, refreshToken, "access refrsh");

      return {
        success: true,
        message: "Login Successfull",
        refreshToken,
        accessToken,
      };
      
    } catch (error:unknown) {
      console.error("Error while loging admin", error);
      return { success:false, message:"Admin does't exist" };
    }
  }
  
}
