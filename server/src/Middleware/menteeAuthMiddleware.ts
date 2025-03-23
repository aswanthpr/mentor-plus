import { Request, Response, NextFunction } from "express";
import menteeModel from "../Model/menteeModel";
import { verifyAccessToken, verifyRefreshToken } from "../Utils/jwt.utils";
import mongoose from "mongoose";
import { Status } from "../Utils/httpStatusCode";

const menteeAuthorization = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    //checking fresh token valid
    if (!refreshToken || !verifyRefreshToken(refreshToken)) {
      res.status(Status?.Unauthorized).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
      return;
    }
    //get access token from authorizatoin header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      res.status(Status?.Unauthorized).json({
        success: false,
        message: "Unauthorized. No token provided.",
      });
      return;
    }
 
    const token: string | undefined = authHeader?.split(" ")[1];
    if (!token) {
      res.status(Status.Unauthorized).json({ success: false, message: "You do not have permission to access this resource.", user: false });
       return
  }
    //jwt verifying
    const decode = verifyAccessToken(token as string);

    if (decode?.error == "TokenExpired") {
      res
        .status(Status?.Forbidden)
        .json({ success: false, message: "Token Expired." });
      return;
    }

    if (decode?.error == "TamperedToken") {
      res
        .status(Status?.Unauthorized)
        .json({ success: false, message: "Token Invalid." });
      return;
    }

    if (decode?.role !== "mentee") {
      res
        .status(Status?.Unauthorized)
        .json({ success: false, message: "user role is invalid" });
      return;
    }

    const menteeData = await menteeModel.findById(decode?.userId);

    if (!menteeData || menteeData?.isBlocked) {
      res
        .status(Status?.Unauthorized)
        .json({ message: "Mentee Not Found", success: false });
      return;
    }

    req.user = new mongoose.Types.ObjectId(decode?.userId as string);

    next();

  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
};

export default menteeAuthorization;
