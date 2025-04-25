import { Request, Response, NextFunction } from "express";
import MenteeModel from "../Model/menteeModel";
import { verifyAccessToken } from "../Utils/jwt.utils";
import { Status } from "../Constants/httpStatusCode";
import { HttpResponse } from "../Constants/httpResponse";
import { HttpError } from "../Utils/http-error-handler.util";

const adminAuthorization = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    //checking fresh token valid
    const refreshToken = req.cookies?.adminToken;
    if (!refreshToken) {
      res.status(Status?.Unauthorized).json({
        success: false,
        message: HttpResponse?.UNAUTHORIZED,
      });
      return;
    }

    //get access token from authorizatoin header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      res
        .status(Status?.Unauthorized)
        .json({ success: false, message:  HttpResponse?.UNAUTHORIZED });
      return;
    }

    const token: string | undefined = authHeader?.split(" ")[1];

    //jwt verifying
    const decode = verifyAccessToken(token as string, "admin");
    
    if (decode?.error == "TokenExpired") {
      res
        .status(Status?.Forbidden)
        .json({ success: false, message: HttpResponse?.TOKEN_EXPIRED });
      return;
    }

        if (decode?.result?.role !== "admin"||!decode?.isValid) {
          res
            .status(Status?.Unauthorized)
            .json({ success: false, message: HttpResponse?.INVALID_USER_ROLE });
          return;
        }
    if (decode?.error == "TamperedToken" ) {
      res
        .status(Status?.Unauthorized)
        .json({ success: false, message: HttpResponse?.UNAUTHORIZED });
      return;
    }


    const adminData = await MenteeModel.findById(decode?.result?.userId, {
      isAdmin: true,
    });

    if (!adminData) {
      res
        .status(Status?.Unauthorized)
        .json({ message: HttpResponse?.UNAUTHORIZED, success: false });
      return;
    }

    req.user =  decode?.result?.userId ;
    next();
  } catch (error: unknown) {
    throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
  }
};

export default adminAuthorization;
