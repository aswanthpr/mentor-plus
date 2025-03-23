import { Request, Response, NextFunction } from "express";
import MenteeModel from "../Model/menteeModel";
import { verifyAccessToken, verifyRefreshToken } from "../Utils/jwt.utils";
import { Status } from "../Utils/httpStatusCode";

const adminAuthorization = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {

    //checking fresh token valid
    const refreshToken = req.cookies?.adminToken;

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
      res
        .status(Status?.Unauthorized)
        .json({ success: false, message: "Unauthorized. No token provided." });
      return;
    }

    const token: string | undefined = authHeader?.split(" ")[1];

    //jwt verifying
    const decode = verifyAccessToken(token as string);

    if (decode?.error == "TamperedToken") {
      res
        .status(Status?.Unauthorized)
        .json({ success: false, message: "Token Invalid." });
      return;
    }

    if (decode?.error == "TokenExpired") {
      res
        .status(Status?.Forbidden)
        .json({ success: false, message: "Token Expired." });
      return;
    }
   

    if (decode.role !== "admin") {
      res
        .status(Status?.Unauthorized)
        .json({ success: false, message: "user role is invalid" });
      return;
    }
  
    const adminData = await MenteeModel.findById(decode?.userId, {
      isAdmin: true,
    });

    if (!adminData) {
      res
        .status(Status?.Unauthorized)
        .json({ message: "admin not found", success: false });
      return;
    }

    req.user = { adminId: decode?.userId };
    next();
  } catch (error: unknown) {
    console.log(
      `\x1b[35m%s\x1b[0m`,
      error instanceof Error ? error.message : String(error)
    );
  }
};

export default adminAuthorization;
