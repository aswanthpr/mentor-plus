import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, verifyRefreshToken } from "../Utils/jwt.utils";
import mentorModel from "../Model/mentorModel";
import mongoose from "mongoose";
import { Status } from "../Utils/httpStatusCode";

const mentorAuthorization = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken = req.cookies?.mentorToken;
    //checking fresh token valid
    if (!refreshToken || !verifyRefreshToken(refreshToken, "mentor")) {
      res.status(Status.Unauthorized).json({
        success: false,
        message: "You are not authorized. Please log in.",
      });
      return;
    }
    //get access token from authorizatoin header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      res
        .status(Status.Unauthorized)
        .json({
          success: false,
          message: "Unauthorized. No token provided.",
          user: false,
        });
      return;
    }

    const token: string | undefined = authHeader?.split(" ")[1];
    if (!token) {
      res
        .status(Status.Unauthorized)
        .json({
          success: false,
          message: "You do not have permission to access this resource.",
          user: false,
        });
      return;
    }
    //jwt verifying
    const decode = verifyAccessToken(token as string, "mentor");

    if (decode?.error == "TokenExpired") {
      res
        .status(Status?.Forbidden)
        .json({ success: false, message: "Token Expired." });
      return;
    }

    if (decode?.error == "TamperedToken"||!decode?.isValid) {
      res
        .status(Status?.Unauthorized)
        .json({ success: false, message: "Token Invalid." });
      return;
    }
   
    const mentorData = await mentorModel.findById(decode?.result?.userId);

    if (!mentorData?.name || mentorData?.isBlocked) {
      res
        .status(Status.Unauthorized)
        .json({
          message: "You do not have permission to access this resource.",
          success: false,
          user: false,
        });
      return;
    }
    if (decode?.result?.role !== "mentor") {
      res
        .status(Status?.Unauthorized)
        .json({ success: false, message: "user role is invalid" });
      return;
    }

    req.user = new mongoose.Types.ObjectId(decode?.result?.userId as string);

    next();
  } catch (error: unknown) {
    res.status(Status.Forbidden).json({
      success: false,
      message: "You do not have permission to access this resource.",
    });
    console.log(error instanceof Error ? error.message : String(error));
  }
};

export default mentorAuthorization;
