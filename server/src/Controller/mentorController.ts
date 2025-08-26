import { NextFunction, Request, Response } from "express";
import { ImentorController } from "../Interface/Mentor/iMentorController";
import { ImentorService } from "../Interface/Mentor/iMentorService";
import { ObjectId } from "mongoose";
import { Status } from "../Constants/httpStatusCode";
import { setCookie } from "../Utils/index";

export class mentorController implements ImentorController {
  constructor(private _mentorService: ImentorService) {}

  async mentorLogout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res
        .status(Status?.Ok)
        .clearCookie("refreshToken", { httpOnly: true })
        .json({ success: true, message: "Logged out successfully" });
    } catch (error: unknown) {
      next(error);
    }
  }

  async mentorProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];

      const { result, categories, success, message, status } =
        await this._mentorService.mentorProfile(token as string);

      res.status(status).json({
        success,
        message,
        result,
        categories,
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  //for creating new access token
  async mentorRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this._mentorService.mentorRefreshToken(
        req.cookies?.refreshToken
      );

      setCookie(res, result?.refreshToken as string)
        .status(result?.status)
        .json({
          success: result?.success,
          message: result?.message,
          accessToken: result?.accessToken,
        });
    } catch (error: unknown) {
      next(error);
    }
  }
  //mentor password changing
  async profilePasswordChange(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { currentPassword, newPassword, _id } = req.body;
      const result = await this._mentorService.passwordChange(
        currentPassword,
        newPassword,
        _id
      );
      res.status(result?.status).json(result);
    } catch (error: unknown) {
      next(error);
    }
  }

  //metnor profile image change
  async mentorProfileImageChange(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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

      res.status(result?.status).json(result);
    } catch (error: unknown) {
      next(error);
    }
  }

  async mentorEditProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const resume =
        req.files &&
        (req.files as { [key: string]: Express.Multer.File[] }).resume
          ? (req.files as { [key: string]: Express.Multer.File[] }).resume[0]
          : null;

      const mentorData = {
        ...req.body,
      };

      const { status, success, message, result } =
        await this._mentorService.mentorEditProfile(mentorData, resume);

      res.status(status).json({ success, message, result });
    } catch (error: unknown) {
      next(error);
    }
  }
  //fetch mentor home data
  // /mentor/home/:filter
  async questionData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { filter } = req.params;
      const { search, page = 1, limit, sortOrder, sortField } = req.query;

      const { status, success, message, homeData, totalPage } =
        await this._mentorService.questionData(
          filter as string,
          String(search),
          String(sortField),
          String(sortOrder),
          Number(page),
          Number(limit)
        );
      const userId = req.user as Express.User;
      res
        .status(status)
        .json({ success, message, homeData, userId, totalPage });
    } catch (error: unknown) {
      next(error);
    }
  }
  //create time slots in mentor side
  // /mentor/schedule/create-slots
  // get the scheule time in the req.body
  async createTimeSlots(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { type, schedule } = req.body;

      const { success, status, message, timeSlots } =
        await this._mentorService.createTimeSlots(
          type,
          schedule,
          req.user as ObjectId
        );
      res.status(status).json({ success, message, status, timeSlots });
    } catch (error: unknown) {
      next(error);
    }
  }

  //schedule getting data.  /schedule/get-time-slots
  async getTimeSlots(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { search, filter, sortField, sortOrder, page, limit } = req.query;

      const { success, status, message, timeSlots, totalPage } =
        await this._mentorService.getTimeSlots(
          req.user as ObjectId,
          Number(limit),
          Number(page),
          String(search),
          String(filter),
          String(sortField),
          String(sortOrder)
        );
      res
        .status(status)
        .json({ success, message, status, timeSlots, totalPage });
    } catch (error: unknown) {
      next(error);
    }
  }

  async removeTimeSlot(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { slotId } = req.body;

      const { status, success, message } =
        await this._mentorService.removeTimeSlot(slotId as string);
      res.status(status).json({ message, success });
    } catch (error: unknown) {
      next(error);
    }
  }
  async chartData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { timeRange } = req.query;

      const { success, message, status, result } =
        await this._mentorService.mentorChartData(
          req.user as Express.User as ObjectId,
          String(timeRange)
        );

      res.status(status).json({ message, success, result });
    } catch (error: unknown) {
      next(error);
    }
  }
}
