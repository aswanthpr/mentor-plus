import { Request, Response, NextFunction } from "express";
// import { JwtPayload } from "jsonwebtoken";
import MenteeModel from "../Model/menteeModel";
import { verifyAccessToken, verifyRefreshToken } from "../Utils/jwt.utils";
import mongoose from "mongoose";

// interface IAuthenticatedRequest extends Request {
//   user?: {
//     userId: string | JwtPayload;
//   };
// }

const authorize = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      res
        .status(403)
        .json({
          success: false,
          message: "Unauthorized. No token provided."});
      return;
    }
    const token: string | undefined = authHeader?.split(" ")[1];

    const decode = verifyAccessToken(token as string);
    if (!decode || !decode.userId) {
      res
        .status(403)
        .json({ success: false, message: "Invalid token."});
      return;
    }
    const menteeData = await MenteeModel.findById(decode?.userId);

    if (!menteeData || menteeData?.isBlocked) {
      res
        .status(403)
        .json({ message: "Mentee Not Found", success: false});
      return;
    }

    req.user  =  new mongoose.Types.ObjectId(decode?.userId as string)  

    next();
  } catch (error: unknown) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken || !verifyRefreshToken(refreshToken)) {
      res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
      return;
    }
    res.status(403).json({
      success: false,
      message: "Token expired or invalid.",
    });
    console.log(error instanceof Error ? error.message : String(error));
  }
};

export default authorize;

