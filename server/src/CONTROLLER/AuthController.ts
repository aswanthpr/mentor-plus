import { Request, Response } from "express";
import { IAuthController } from "../INTERFACE/Auth/IAuthController";
import IAuthService from "../INTERFACE/Auth/IAuthService";
import IOtpService from "../INTERFACE/Otp/IOtpService";
import { IOtp } from "../MODEL/otpModel";

export class AuthController implements IAuthController {
  constructor(
    private _AuthService: IAuthService,
    private _OtpService: IOtpService
  ) {}

  //mentee sinup controll
  async menteeSignup(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.body, "signup req body");
      const result = await this._AuthService.mentee_Signup(req.body);
      if (!result.success) {
        res.status(409).json({ success: false, message: result.message });
      }
      await this._OtpService.sentOtptoMail(req.body.email);
      if (result) {
        res.status(200).json({
          success: true,
          message: "OTP successfully sent to mail",
        });
      }
    } catch (error: unknown) {
      console.error("error during mentee registration");
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
      console.log(req.body);
      const { email, otp } = req.body;
      if (!email || !otp) {
        res
          .status(400)
          .json({ success: false, message: "Email or OTP is missing" });
      }

      const result = await this._OtpService.BLVerifyOtp(email, otp);

      if (result && result.success) {
        res.status(200).json({
          success: true,
          message: "OTP verified successfully. Signup complete!",
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

  async getMainLogin(req:Request,res:Response):Promise<void>{
    try {
      console.log(req.body,'this is from getMain login')
      const {formData} =req.body;
      if(!formData){
        res
        .status(400)
        .json({ success: false, message:"Email and  password missing" })
      }
      const result = await this._AuthService.BLMainLogin(formData);

      if(result.success){
        res.status(200).json(result)
      }else{
        res.status(401).json(result)
      }
    } catch (error:unknown) {
      throw new Error(`error while Login in getMainLogin ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  
}
