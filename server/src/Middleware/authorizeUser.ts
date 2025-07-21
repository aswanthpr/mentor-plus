import { Request, Response, NextFunction } from "express";
import mongoose, { Model } from "mongoose";
import { verifyAccessToken } from "../Utils/jwt.utils";
import { Status } from "../Constants/httpStatusCode";
import { HttpResponse } from "../Constants/httpResponse";
import { HttpError } from "../Utils/http-error-handler.util";
import menteeModel from "../Model/menteeModel";
import mentorModel from "../Model/mentorModel";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const modelMap: Record<string, Model<any>> = {
  admin: menteeModel, // assuming admin is also in menteeModel
  mentee: menteeModel,
  mentor: mentorModel,
} as const;

const authorizeUser = (role: keyof typeof modelMap) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        res.status(Status.Unauthorized).json({
          success: false,
          message: HttpResponse.UNAUTHORIZED,
        });
        return;
      }

      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer")) {
        res.status(Status.Unauthorized).json({
          success: false,
          message: HttpResponse.UNAUTHORIZED,
        });
        return;
      }
      const token = authHeader.split(" ")[1];

      if (!token) {
        res.status(Status.Unauthorized).json({
          success: false,
          message: HttpResponse.UNAUTHORIZED,
        });
        return;
      }

      const decode = verifyAccessToken(token, role);

      if (decode?.error === "TokenExpired") {
        res.status(Status.Forbidden).json({
          success: false,
          message: HttpResponse.TOKEN_EXPIRED,
        });
        return;
      }

      if (decode?.error === "TamperedToken") {
        res.status(Status.Unauthorized).json({
          success: false,
          message: HttpResponse.UNAUTHORIZED,
        });
        return;
      }

      const userId = decode?.result?.userId;
      const Model = modelMap[role];

      const user = await Model.findById(userId);

      if (!user || user.isBlocked || (role === "mentor" && !user.name)) {
        res.status(Status.Unauthorized).json({
          success: false,
          message: HttpResponse.UNAUTHORIZED,
        });
        return;
      }

      req.user = new mongoose.Types.ObjectId(userId as string);
      next();
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status.InternalServerError
      );
    }
  };
};

export default authorizeUser;
