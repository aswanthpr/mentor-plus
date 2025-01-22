import { Request, Response } from "express";
import { IauthController } from "../Interface/Auth/iAuthController";
import IauthService from "../Interface/Auth/iAuthService";
import IotpService from "../Interface/Otp/iOtpService";
import { ImentorApplyData } from "src/Types";
import { Imentee } from "src/Model/menteeModel";

export class authController implements IauthController {
  constructor(
    private _AuthService: IauthService,
    private _OtpService: IotpService
  ) { }

  //mentee sinup controll
  async menteeSignup(req: Request, res: Response): Promise<void> {
    try {
       await this._AuthService.mentee_Signup(req.body);

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
        `error while mentee Signup ${error instanceof Error ? error.message : error
        }`
      );
    }
  }
  //get signup otp and email
  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp, type } = req.body;

      const result = await this._OtpService.verifyOtp(email, otp, type);
      console.log(result, "this is otp result");
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
        `Error while receving Otp${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  //for singup otpverify resend otp
  async resendOtp(req: Request, res: Response): Promise<void> {
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
        `error while resend otp ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async mainLogin(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.body, "this is from getMain login");

      const { email, password } = req.body;

      const result = await this._AuthService.mainLogin(email, password);
      if (!result) {
        res
          .status(400)
          .json({ success: false, message: "user not found. Please Singup" });
        return;
      }

      if (result.success) {
        res
          .status(200)
          .cookie("refreshToken", `${result?.refreshToken}`, {
            httpOnly: true,
            secure: false, //process.env.NODE_ENV === 'production',
            sameSite: "lax",
            maxAge: 14 * 24 * 60 * 60 * 1000,
          })
          .json({
            success: result?.success,
            message: result?.message,
            accessToken: result?.accessToken,
          });

        return;
      } else {
        res
          .status(401)
          .json({ success: result.success, message: result.message });
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
        `error while Login in getMainLogin ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._AuthService.forgotPassword(req.body.email);

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
        `error while forgetpass in getforgetPassword ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async forgot_PasswordChange(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      console.log(data, "this is the datat");
      const result = await this._AuthService.forgot_PasswordChange(
        data.email,
        data.password
      );
      if (result?.success && result?.message) {
        res
          .status(200)
          .json({ success: true, message: "password changed successfully" });
      }
      if (result?.message === "credencial is missing") {
        res.status(400).json({ success: false, message: result.message });
        return;
      } else if (result?.message === "user not exist.Please signup") {
        res.status(404).json({ success: false, message: result.message });
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
        `Error while handling forgot password request: ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  //admin Login
  async adminLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      console.log(email, password, "thsi is the email and password");
      const result = await this._AuthService.adminLogin(email, password);

      if (!result) {
        res
          .status(400)
          .json({ success: false, message: "user not found. Please Singup" });
        return;
      }

      if (result.success) {
        res
          .status(200)
          .cookie("adminToken", result?.refreshToken as string, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 24 * 60 * 60 * 1000,
            path: "/",
          })
          .json(result);

        return;
      } else {
        res.status(401).json(result);
        return;
      }
    } catch (error: unknown) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });

      throw new Error(
        `error while admin Login${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  //---------------------------------------------------------------------------
  async mentorFields(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._AuthService.mentorFields();

      res.status(result.status).json({
        success: result.success,
        message: result.message,
        categories: result.categories,
      });
    } catch (error: unknown) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });

      throw new Error(
        `error while getting mentorRoles${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async mentorApply(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        email,
        password,
        phone,
        jobTitle,
        category,
        linkedinUrl,
        githubUrl,
        bio,
        skills,
      } = req.body;

      const profileImage =
        req.files &&
          (req.files as { [key: string]: Express.Multer.File[] }).profileImage
          ? (req.files as { [key: string]: Express.Multer.File[] })
            .profileImage[0]
          : null;

      const resume =
        req.files &&
          (req.files as { [key: string]: Express.Multer.File[] }).resume
          ? (req.files as { [key: string]: Express.Multer.File[] }).resume[0]
          : null;

      const mentorData: ImentorApplyData = {
        body: {
          name,
          email,
          phone,
          password,
          jobTitle,
          category,
          linkedinUrl,
          githubUrl,
          bio,
          skills,
        },
        files: { profileImage, resume },
      };
      const result = await this._AuthService.mentorApply(mentorData);

      res
        .status(result?.status)
        .json({ success: result?.success, message: result?.message });
    } catch (error: unknown) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });

      throw new Error(
        `error while mentor application ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  //metnor login;
  async mentorLogin(req: Request, res: Response): Promise<void> {
    try {
      const response = await this._AuthService.mentorLogin(
        req.body?.email,
        req.body?.password
      );

      res
        .status(response.status)
        .cookie("mentorToken", response.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 15 * 24 * 60 * 60 * 1000,
          path: "/",
        })
        .json({
          success: response.success,
          message: response.message,
          accessToken: response.accessToken,
        });
    } catch (error: unknown) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });

      throw new Error(
        `error while mentor signup ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  //forget password for mentor

  async mentorForgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._AuthService.mentorForgotPassword(
        req.body.email
      );

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
        `error while forgetpass in getforgetPassword ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async mentorForgot_PasswordChange(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const data = req.body;
      console.log(data, "this is the datat");
      const result = await this._AuthService.mentorForgot_PasswordChange(
        data.email,
        data.password
      );
      if (result?.success && result?.message) {
        res
          .status(200)
          .json({ success: true, message: "password changed successfully" });
      }
      if (result?.message === "credencial is missing") {
        res.status(400).json({ success: false, message: result.message });
        return;
      } else if (result?.message === "user not exist.Please signup") {
        res.status(404).json({ success: false, message: result.message });
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
        `Error while handling metnor forgot password request: ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async googleAuth(req: Request, res: Response): Promise<void> {
    try {

      const {accessToken,refreshToken}  =  await this._AuthService.googleAuth(req.user  as Imentee) ;
 
      res.cookie('refreshToken',refreshToken,{
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production',
        sameSite:'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      res.redirect(`http://localhost:5173/mentee/google/success?token=${accessToken}`);
    } catch (error: unknown) {
      res.status(500).json({
        status: 'error',
        message: `Error while Google auth: ${
          error instanceof Error ? error.message : String(error)
        }`,
      });
      
    }
  }

 
}
