import { NextFunction, Request, Response } from "express";
import { IauthController } from "../Interface/Auth/iAuthController";
import IauthService from "../Interface/Auth/iAuthService";
import IotpService from "../Interface/Otp/iOtpService";
import { ImentorApplyData } from "../Types";
import { Imentee } from "../Model/menteeModel";

export class authController implements IauthController {
  constructor(
    private _AuthService: IauthService,
    private _OtpService: IotpService
  ) {}

  //mentee sinup controll
  async menteeSignup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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
      next(error);
    }
  }
  //get signup otp and email
  async verifyOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, otp, type } = req.body;

      const { status, message, success } = await this._OtpService.verifyOtp(
        email,
        otp,
        type
      );

      res.status(status).json({
        success,
        message,
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  //for singup otpverify resend otp
  async resendOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;

      const { message, status, success } = await this._OtpService.sentOtptoMail(
        email
      );
      res.status(status).json({ message, success });
    } catch (error: unknown) {
      next(error);
    }
  }

  async mainLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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
      next(error);
    }
  }
  async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this._AuthService.forgotPassword(req.body.email);

      res.status(result?.status as number).json(result);
    } catch (error: unknown) {
      next(error);
    }
  }
  async forgot_PasswordChange(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = req.body;

      const { message, status, success } =
        await this._AuthService.forgot_PasswordChange(
          data.email,
          data.password
        );

      res.status(status).json({ success, message });
    } catch (error: unknown) {
      next(error);
    }
  }

  //admin Login
  async adminLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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
      next(error);
    }
  }
  //---------------------------------------------------------------------------
  async mentorFields(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this._AuthService.mentorFields();

      res.status(result.status).json({
        success: result.success,
        message: result.message,
        categories: result.categories,
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async mentorApply(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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
      next(error);
    }
  }
  //metnor login;
  async mentorLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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
      next(error);
    }
  }

  //forget password for mentor

  async mentorForgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { message, status, success } =
        await this._AuthService.mentorForgotPassword(req.body.email);

      res.status(status).json({ message, success });
    } catch (error: unknown) {
      next(error);
    }
  }
  async mentorForgot_PasswordChange(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = req.body;

      const { message, success, status } =
        await this._AuthService.mentorForgot_PasswordChange(
          data.email,
          data.password
        );

      res.status(status).json({ success, message });
    } catch (error: unknown) {
      next(error);
    }
  }

  async googleAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { accessToken, refreshToken } = await this._AuthService.googleAuth(
        req.user as Imentee
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.redirect(
        `${process.env.CLIENT_ORIGIN_URL}/mentee/google/success?token=${accessToken}`
      );
    } catch (error: unknown) {
      next(error);
    }
  }
}
