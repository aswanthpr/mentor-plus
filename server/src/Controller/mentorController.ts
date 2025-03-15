import { Request, Response } from "express";
import { ImentorController } from "../Interface/Mentor/iMentorController";
import { ImentorService } from "../Interface/Mentor/iMentorService";
import { ObjectId } from "mongoose";

export class mentorController implements ImentorController {
  constructor(private _mentorService: ImentorService) {}

  async mentorLogout(req: Request, res: Response): Promise<void> {
    try {
      res
        .status(200)
        .clearCookie("mentorToken", { httpOnly: true })
        .json({ success: true, message: "Logged out successfully" });
    } catch (error: unknown) {
      res.status(500).json({
        success: false,
        message: "An internal server error occurred. Please try again later.",
      });
      throw new Error(
        `Error while mentee  logout ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async mentorProfile(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];

      const { result, categories, success, message, status } =
        await this._mentorService.mentorProfile(token as string);

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
  async mentorRefreshToken(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._mentorService.mentorRefreshToken(
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
      res.status(500).json({
        success: false,
        message: "An internal server error occurred. Please try again later.",
      });

      throw new Error(
        `error while geting refreshToken${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  //mentor password changing
  async profilePasswordChange(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.body, "this is the password");
      const { currentPassword, newPassword, _id } = req.body;
      const result = await this._mentorService.passwordChange(
        currentPassword,
        newPassword,
        _id
      );
      res.status(result?.status).json(result);
    } catch (error: unknown) {
      res.status(500).json({
        success: false,
        message: "An internal server error occurred. Please try again later.",
      });

      throw new Error(
        `error while profile password changing ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  //metnor profile image change
  async mentorProfileImageChange(req: Request, res: Response): Promise<void> {
    try {
      const { _id } = req.body;

      const profileImage =
        req.files &&
        (req.files as { [key: string]: Express.Multer.File[] }).profileImage
          ? (req.files as { [key: string]: Express.Multer.File[] })
              .profileImage[0]
          : null;

      const result = await this._mentorService.mentorProfileImageChange(
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

  async mentorEditProfile(req: Request, res: Response): Promise<void> {
    try {
      const resume =
        req.files &&
        (req.files as { [key: string]: Express.Multer.File[] }).resume
          ? (req.files as { [key: string]: Express.Multer.File[] }).resume[0]
          : null;
      console.log(resume, "this is resume", req.files);
      const mentorData = {
        ...req.body,
      };

      const { status, success, message, result } =
        await this._mentorService.mentorEditProfile(mentorData, resume);

      res.status(status).json({ success, message, result });
    } catch (error: unknown) {
      throw new Error(
        `error while mentor profile Edit ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  //fetch mentor home data
  // /mentor/home/:filter
  async homeData(req: Request, res: Response): Promise<void> {
    try {
      const { filter } = req.params;
      const { search, page, limit } = req.query;

      const { status, success, message, homeData,totalPage } =
        await this._mentorService.homeData(
          filter as string,
          String(search),
          Number(page),
          Number(limit)
        );
      const userId = req.user as Express.User;
      res.status(status).json({ success, message, homeData, userId ,totalPage});
    } catch (error: unknown) {
      throw new Error(
        `error while mentor profile Edit ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  //create time slots in mentor side
  // /mentor/schedule/create-slots
  // get the scheule time in the req.body
  async createTimeSlots(req: Request, res: Response): Promise<void> {
    try {
      const { type, schedule } = req.body;
      console.log(type, schedule, "creaeSchedule");
      const { success, status, message, timeSlots } =
        await this._mentorService.createTimeSlots(
          type,
          schedule,
          req.user as ObjectId
        );
      res.status(status).json({ success, message, status, timeSlots });
    } catch (error: unknown) {
      throw new Error(
        `error while mentor creating time slots  ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  //schedule getting data.  /schedule/get-time-slots
  async getTimeSlots(req: Request, res: Response): Promise<void> {
    try {
      const { success, status, message, timeSlots } =
        await this._mentorService.getTimeSlots(req.user as ObjectId);
      res.status(status).json({ success, message, status, timeSlots });
    } catch (error: unknown) {
      throw new Error(
        `error while mentor getting time slots  ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async removeTimeSlot(req: Request, res: Response): Promise<void> {
    try {
      const { slotId } = req.body;
      console.log(slotId, "ths is slot id");
      const { status, success, message } =
        await this._mentorService.removeTimeSlot(slotId as string);
      res.status(status).json({ message, success });
    } catch (error: unknown) {
      throw new Error(
        `error while mentor getting time slots  ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
