import { Request, Response } from "express";
import { ImenteeService } from "../Interface/Mentee/iMenteeService";
import { ImenteeController } from "../Interface/Mentee/iMenteeController";
import { log } from "console";

export class menteeController implements ImenteeController {
  constructor(private _menteeService: ImenteeService) {}

  //for creating new access token
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._menteeService.refreshToken(
        req.cookies?.refreshToken
      );

      if (result?.success) {
        res.cookie("refreshToken", result?.refreshToken as string, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 14 * 24 * 60 * 60 * 1000,
        });
      }

      res.status(result.status).json({
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

  async menteeLogout(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.path.split("/"));
      res.clearCookie("refreshToken");
      res
        .status(200)
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

  async menteeProfile(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];
      const result = await this._menteeService.menteeProfile(token as string);

      res.status(result?.status).json({
        success: result?.success,
        message: result?.message,
        result: result?.result,
      });
    } catch (error: unknown) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
      throw new Error(
        `Error while get mentee  profile data ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async menteeProfileEdit(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.body, "this is req.body of profile edit data");
      const result = await this._menteeService.editMenteeProfile(req.body);

      res.status(result?.status).json(result);
    } catch (error: unknown) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
      throw new Error(
        `Error while get mentee  profile editing ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  //mentee profile password change
  async passwordChange(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.body, "thsi isthe passwords");
      const { currentPassword, newPassword, _id } = req.body;
      const result = await this._menteeService.passwordChange(
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
        `Error while get mentee  profile password changing ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async profileChange(req: Request, res: Response): Promise<void> {
    try {
      const { _id } = req.body;
      const profileImage =
        req.files &&
        (req.files as { [key: string]: Express.Multer.File[] }).profileImage
          ? (req.files as { [key: string]: Express.Multer.File[] })
              .profileImage[0]
          : null;

      const result = await this._menteeService.profileChange(profileImage, _id);

      res.status(result.status).json(result);
    } catch (error: unknown) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
      throw new Error(
        `Error while get mentee  profile changing ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  //get mentor data in explore
  async exploreData(req: Request, res: Response): Promise<void> {
    try {
      const { status, message, success, category, mentor, skills } =
        await this._menteeService.exploreData();

      res.status(status).json({ message, success, category, mentor, skills });
    } catch (error: unknown) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
      throw new Error(
        `Error getting mentor data in explore ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async homeData(req: Request, res: Response): Promise<void> {
    try {
      const { filter } = req.params;
      const { status, success, message, homeData } =
        await this._menteeService.homeData(filter as string);
      const userId = req.user as Express.User;
      res.status(status).json({ success, message, homeData, userId });
    } catch (error: unknown) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
      throw new Error(
        `Error getting mentor data in explore ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  // /mentee/explore/mentor/:id

  async getSimilarMentors(req: Request, res: Response): Promise<void>{
    try {
      const {category,mentorId}  = req.query;
      console.log(category, "this is mentorid");
      const { status, message, success, mentor } =
        await this._menteeService.getMentorDetailes(category as string,mentorId as string);
        console.log(mentor,'3333333333333333333')
      res.status(status).json({ success, message, mentor });
    } catch (error: unknown) {
      throw new Error(
        `Error while  getting mentor data in explore ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } 
  }
//get timeslots for booking page 
//mentee/slot-booking/slot
// @params mentorId
// @returns timeSlot[]

async getTimeSlots(req: Request, res: Response): Promise<void> {
  try {
    const {mentorId} = req.query;
    console.log(mentorId,'mentorid')
    const {success,status,message,timeSlots} = await this._menteeService.getTimeSlots(mentorId as string)
console.log(timeSlots)
     res.status(status).json({success,message,timeSlots});
  } catch (error:unknown) {
    throw new Error(
      `Error while  getting timeslots for booking  ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
}
