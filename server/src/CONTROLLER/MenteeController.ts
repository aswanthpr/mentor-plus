import { Request, Response } from "express";
import { IMenteeService } from "../INTERFACE/Mentee/IMenteeService";
import { IMenteeController } from "../INTERFACE/Mentee/IMenteeController";

export class MenteeController implements IMenteeController {
  constructor(private _menteeService: IMenteeService) {}

  //for creating new access token
  async getRefreshToken(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._menteeService.BLRefreshToken(
        req.cookies?.refreshToken
      );

      if (result?.success) {
        res.cookie("refreshToken", result?.refreshToken as string, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "none",
          maxAge: 14 * 24 * 60 * 60 * 1000,
        });
      }

      res
        .status(result.status)
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

  async getMenteeLogout(req: Request, res: Response): Promise<void> {
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

  async getMenteeProfile(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];
      console.log(token, "thsi si the token from header");

      console.log(req.cookies.refreshToken, req.cookies, req.signedCookies);

      const result = await this._menteeService.blMenteeProfile(token as string);

      res
        .status(result?.status)
        .json({
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
  async getMenteeProfileEdit(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.body, "this is req.body of profile edit data");
      const result = await this._menteeService.blEditMenteeProfile(req.body);

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
  async getPasswordChange(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.body, "thsi isthe passwords");
      const { currentPassword, newPassword, _id } = req.body;
      const result = await this._menteeService.blPasswordChange(
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
  async getProfileChange(req: Request, res: Response): Promise<void> {
    try {
      const { _id } = req.body;
      const profileImage =
        req.files &&
        (req.files as { [key: string]: Express.Multer.File[] }).profileImage
          ? (req.files as { [key: string]: Express.Multer.File[] })
              .profileImage[0]
          : null;

      const result = await this._menteeService.blProfileChange(
        profileImage,
        _id
      );

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
  async getExploreData(req: Request, res: Response): Promise<void> {
    try {
      const {status,message,success,category,mentor,skills} = await this._menteeService.blExploreData();

      res.status(status).json({message,success,category,mentor,skills});
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

}
