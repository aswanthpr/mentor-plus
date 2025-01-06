import { Request, Response } from "express";
import { IMentorController } from "../INTERFACE/Mentor/IMentorController";
import { IMentorService } from "../INTERFACE/Mentor/IMentorService";

export class MentorController implements IMentorController {
  constructor(private _mentorService: IMentorService) {}

  async getMentorLogout(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.path.split("/"));

      res
        .status(200)
        .clearCookie("mentorToken", { httpOnly: true })
        .json({ success: true, message: "Logged out successfully" });
    } catch (error: unknown) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
      throw new Error(
        `Error while mentee  logout ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async getMentorProfile(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];

      const { result, categories, success, message, status } =
        await this._mentorService.blMentorProfile(token as string);

      console.log(result, "...........................", req.user);
      res.status(status).json({
        success,
        message,
        result,
        categories,
      });
    } catch (error: unknown) {
      throw new Error(
        `Error while mentee  logout ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  //for creating new access token
  async getMentorRefreshToken(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._mentorService.blMentorRefreshToken(
        req.cookies?.mentorToken
      );

      res
        .status(result.status)
        .cookie("mentorToken", result?.refreshToken as string, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production" || false, //in development fasle
          sameSite: "lax",
          maxAge: 14 * 24 * 60 * 60 * 1000,
        })
        .json({
          success: result?.success,
          message: result?.message,
          accessToken: result?.accessToken,
        });
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
  //mentor password changing
  async getProfilePasswordChange(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.body, "this is the password");
      const { currentPassword, newPassword, _id } = req.body;
      const result = await this._mentorService.blPasswordChange(
        currentPassword,
        newPassword,
        _id
      );
      res.status(result?.status).json(result);
    } catch (error: unknown) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });

      throw new Error(
        `error while profile password changing ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  //metnor profile image change
  async getMentorProfileImageChange(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { _id } = req.body;

      const profileImage =
        req.files &&
        (req.files as { [key: string]: Express.Multer.File[] }).profileImage
          ? (req.files as { [key: string]: Express.Multer.File[] })
              .profileImage[0]
          : null;

      const result = await this._mentorService.blMentorProfileImageChange(
        profileImage,
        _id
      );

      res.status(result.status).json(result);
    } catch (error: unknown) {
      throw new Error(
        `error while mentor profile image change${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async getMentorEditProfile(req: Request, res: Response): Promise<void> {
    try {

      const resume =
        req.files &&
        (req.files as { [key: string]: Express.Multer.File[] }).resume
          ? (req.files as { [key: string]: Express.Multer.File[] }).resume[0]
          : null;
console.log(resume,'this is resume',req.files)
      const mentorData = {
        ...req.body
      };

      const {status,success,message,result} = await this._mentorService.blMentorEditProfile(
        mentorData, resume,
      );
 
      res.status(status).json({ success, message, result });
    } catch (error: unknown) {
      throw new Error(
        `error while mentor profile Edit ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
