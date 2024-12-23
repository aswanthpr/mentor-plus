import { Request, Response } from "express";
import { IAuthController } from "../INTERFACE/Auth/IAuthController";
import IAuthService from "../INTERFACE/Auth/IAuthService";
import IOtpService from "../INTERFACE/Otp/IOtpService";

export class AuthController implements IAuthController {
  constructor(
    private _AuthService: IAuthService,
    private _OtpService: IOtpService
  ) {}


  //mentee sinup controll
  async menteeSignup(req: Request, res: Response): Promise<void> {
    try {
      
      const result = await this._AuthService.mentee_Signup(req.body);
      
      await this._OtpService.sentOtptoMail(req.body.email);
    
        res.status(200).json({
          success: true,
          message: "OTP successfully sent to mail",
        });
    
    } catch (error: unknown) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
      throw new Error(
        `error while mentee Signup ${
          error instanceof Error ? error.message : error
        }`
      );
    }
  }
  //get signup otp and email
  async getVerifyOtp(req: Request, res: Response): Promise<void> {
    try {
    
      const { email, otp } = req.body;
      if (!email || !otp) {
        res
          .status(400)
          .json({ success: false, message: "credential is missing" });
      }

      const result = await this._OtpService.BLVerifyOtp(email, otp);

      if (result && result.success) {
        res.status(200).json({
          success: true,
          message: "OTP verified successfully",
        });
      } else {
        res
          .status(400)
          .json({ success: false, message: "Invalid OTP or email" });
      }
    } catch (error: unknown) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
      throw new Error(
        `Error while receving Otp${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  //for singup otpverify resend otp
  async getResendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      console.log(email, "this is from resend otp");
      await this._OtpService.sentOtptoMail(email);
      res.status(200).json({
        success: true,
        message: "OTP successfully sent to mail",
      });
    } catch (error: unknown) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
      throw new Error(
        `error while resend otp ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async getMainLogin(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.body, "this is from getMain login");

      const { email, password } = req.body;

      const result = await this._AuthService.BLMainLogin(email, password);
      if(!result){
         res.status(400).json({success:false,message:'user not found. Please Singup'});
         return
      }
      const refresh_Token = result?.refreshToken as string;
      const accessToken = result?.accessToken as string;

      if (result.success) {
        res.cookie("token", refresh_Token, {
          httpOnly: true,
          secure: false, //in development fasle process.env.NODE_ENV === 'production'
          sameSite: "none",
          maxAge: 15 * 24 * 60 * 60 * 1000,
        });

        delete result.refreshToken;
        res.status(200).json(result);

        return;
      } else {
        res.status(401).json(result);
        return;
      }
    } catch (error: unknown) {
      console.error(
        `Login error: ${error instanceof Error ? error.message : String(error)}`
      );
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
      throw new Error(
        `error while Login in getMainLogin ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async getForgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email, user } = req.body;
      console.log(email, user, "thsi is from forgot password");

      const result = await this._AuthService.BLforgotPassword(email, user);

      if (result?.success == false) {
        res.status(400).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error: unknown) {
      console.error(
        `Login error: ${error instanceof Error ? error.message : String(error)}`
      );

      res
        .status(500)
        .json({ success: false, message: "Internal server error" });

      throw new Error(
        `error while forgetpass in getforgetPassword ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async getForgot_PasswordChange(req:Request,res:Response):Promise<void> {
    try {
      const data  = req.body;
      console.log(data,'this is the datat');
      const result = await this._AuthService.BLforgot_PasswordChange(data.email,data.password);
      if(result?.success&&result?.message){
        res.status(200).json({success:true,message:'password changed successfully'})
      }
      if (result?.message === 'credencial is missing') {
         res.status(400).json({ success: false, message: result.message });
         return;
      } else if (result?.message === 'user not exist.Please signup') {
         res.status(404).json({ success: false, message: result.message });
        return;
      }
      
    } catch (error:unknown) {
      console.error(
        `Login error: ${error instanceof Error ? error.message : String(error)}`
      );

      res.status(500).json({ success: false, message: 'Internal server error' });
    
      throw new Error(
        `Error while handling forgot password request: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  //for creating new access token
  async getAccessToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.signedCookies.token;

      console.log(
        refreshToken,
        "thsi isthe refresh token from cookies",
        req.cookies,
        req.signedCookies
      );
      if (!refreshToken) {
        res
          .status(403)
          .json({ success: false, message: "No refresh token provided" });
        return;
      }
      const result = await this._AuthService.BLAccessToken(refreshToken);
      const refresh_Token = result?.refreshToken as string;

      if (result.success) {
        res.cookie("refreshToken", refresh_Token, {
          signed: true,
          httpOnly: true,
          secure: false, //process.env.NODE_ENV === 'develpment',//in development fasle
          sameSite: "none",
          maxAge: 15 * 24 * 60 * 60 * 1000,
        });

        delete result.refreshToken;
        res.status(200).json(result);
      } else {
        res.status(401).json(result);
      }
    } catch (error: unknown) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });

      throw new Error(
        `error while geting refreshToken${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }



  //admin Login
  async getAdminLogin(req:Request,res:Response):Promise<void>{
    try {
      const {email,password} =req.body;
      console.log(email,password,'thsi is the email and password');
      const result = await this._AuthService.BLadminLogin(email,password);

      if(!result){
        res.status(400).json({success:false,message:'user not found. Please Singup'});
        return
     }

     const refreshToken = result?.refreshToken as string;

     if (result.success) {

       res.cookie("adminToken", refreshToken, {
         httpOnly: true,
         secure: false, //in development fasle process.env.NODE_ENV === 'production'
         sameSite: "none",
         maxAge: 15 * 24 * 60 * 60 * 1000,
         path:'/',
       });
       
       res.status(200).json(result);

       return;
     } else {
       res.status(401).json(result);
       return;
     }
     

      
    } catch (error:unknown) {

    }
  }
  //---------------------------------------------------------------------------
  async getMentorApply(req:Request,res:Response):Promise<void>{
    try {
      
    } catch (error:unknown) {
      
    }
  }
}
