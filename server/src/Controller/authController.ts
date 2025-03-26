import { Request, Response } from "express";
import { IauthController } from "../Interface/Auth/iAuthController";
import IauthService from "../Interface/Auth/iAuthService";
import IotpService from "../Interface/Otp/iOtpService";
import { ImentorApplyData } from "../Types";
import { Imentee } from "../Model/menteeModel";
import { Status } from "../Utils/httpStatusCode";

export class authController implements IauthController {
  constructor(
    private _AuthService: IauthService,
    private _OtpService: IotpService
  ) {}

  //mentee sinup controll
  async menteeSignup(req: Request, res: Response): Promise<void> {
    try {
      const [{ status, success, message }] = await Promise.all([
        this._AuthService.mentee_Signup(req.body),

        this._OtpService.sentOtptoMail(req.body.email),
      ]);

      res.status(status).json({
        success,
        message,
      });
    } catch (error: unknown) {
      res
        .status(Status?.InternalServerError)
        .json({ success: false, message: "Internal server error" });
      throw new Error(
        `error while mentee Signup ${
          error instanceof Error ? error.message : error
        }`
      );
    }
  }
  //get signup otp and email
  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp, type } = req.body;
      console.log(otp, email, type);
      const result = await this._OtpService.verifyOtp(email, otp, type);
      console.log(result, "this is otp result");
      if (result && result.success) {
        res.status(200).json({
          success: true,
          message: "OTP verified successfully",
        });
      } else {
        res
          .status(Status?.BadRequest)
          .json({ success: false, message: "Invalid OTP or email" });
      }
    } catch (error: unknown) {
      res
        .status(Status?.InternalServerError)
        .json({ success: false, message: "Internal server error" });
      throw new Error(
        `Error while receving Otp${
          error instanceof Error ? error.message : String(error)
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
        .status(Status?.InternalServerError)
        .json({ success: false, message: "Internal server error" });
      throw new Error(
        `error while resend otp ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async mainLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const result = await this._AuthService.mainLogin(email, password);

      res
        .status(result?.status)
        .cookie("refreshToken", `${result?.refreshToken ?? ""}`, {
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
    } catch (error: unknown) {
      console.error(
        `Login error: ${error instanceof Error ? error.message : String(error)}`
      );
      res
        .status(Status?.InternalServerError)
        .json({ success: false, message: "Internal server error" });
      throw new Error(
        `error while Login in getMainLogin ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._AuthService.forgotPassword(req.body.email);

      if (result?.success == false) {
        res.status(Status?.BadRequest).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error: unknown) {
      console.error(
        `Login error: ${error instanceof Error ? error.message : String(error)}`
      );

      res
        .status(Status?.InternalServerError)
        .json({ success: false, message: "Internal server error" });

      throw new Error(
        `error while forgetpass in getforgetPassword ${
          error instanceof Error ? error.message : String(error)
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
        res
          .status(Status?.BadRequest)
          .json({ success: false, message: result.message });
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
        .status(Status?.InternalServerError)
        .json({ success: false, message: "Internal server error" });

      throw new Error(
        `Error while handling forgot password request: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  //admin Login
  async adminLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const { success, message, status, refreshToken, accessToken } =
        await this._AuthService.adminLogin(email, password);

      res
        .status(status)
        .cookie("adminToken", refreshToken as string, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 15 * 24 * 60 * 60 * 1000,
          path: "/",
        })
        .json({ message, success, accessToken });

      return;
    } catch (error: unknown) {
      throw new Error(
        `error while admin Login${
          error instanceof Error ? error.message : String(error)
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
        .status(Status?.InternalServerError)
        .json({ success: false, message: "Internal server error" });

      throw new Error(
        `error while getting mentorRoles${
          error instanceof Error ? error.message : String(error)
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
        .status(Status?.InternalServerError)
        .json({ success: false, message: "Internal server error" });

      throw new Error(
        `error while mentor application ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  //metnor login;
  async mentorLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const { status, success, message, accessToken, refreshToken } =
        await this._AuthService.mentorLogin(email, password);

      res
        .status(status)
        .cookie("mentorToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 15 * 24 * 60 * 60 * 1000,
          path: "/",
        })
        .json({
          success,
          message,
          accessToken,
        });
    } catch (error: unknown) {
      res
        .status(Status?.InternalServerError)
        .json({ success: false, message: "Internal server error" });

      throw new Error(
        `error while mentor signup ${
          error instanceof Error ? error.message : String(error)
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
        res.status(Status?.BadRequest).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error: unknown) {
      console.error(
        `Login error: ${error instanceof Error ? error.message : String(error)}`
      );

      res
        .status(Status?.InternalServerError)
        .json({ success: false, message: "Internal server error" });

      throw new Error(
        `error while forgetpass in getforgetPassword ${
          error instanceof Error ? error.message : String(error)
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
        res
          .status(Status?.BadRequest)
          .json({ success: false, message: result.message });
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
        .status(Status?.InternalServerError)
        .json({ success: false, message: "Internal server error" });

      throw new Error(
        `Error while handling metnor forgot password request: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async googleAuth(req: Request, res: Response): Promise<void> {
    try {
      const { accessToken, refreshToken } = await this._AuthService.googleAuth(
        req.user as Imentee
      );

      console.log(
        accessToken,
        "jwt tokens",
        refreshToken,
        "thsi si the jwt tokens"
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      console.log(process.env.CLIENT_ORIGIN_URL);
      res.redirect(
        `${process.env.CLIENT_ORIGIN_URL}/mentee/google/success?token=${accessToken}`
      );
    } catch (error: unknown) {
      res.status(Status?.InternalServerError).json({
        status: "error",
        message: `Error while Google auth: ${
          error instanceof Error ? error.message : String(error)
        }`,
      });
    }
  }
}
