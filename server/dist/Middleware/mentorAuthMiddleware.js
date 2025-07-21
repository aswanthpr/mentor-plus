"use strict";
// import { Request, Response, NextFunction } from "express";
// import { verifyAccessToken } from "../Utils/jwt.utils";
// import mentorModel from "../Model/mentorModel";
// import mongoose from "mongoose";
// import { Status } from "../Constants/httpStatusCode";
// import { HttpError } from "../Utils/http-error-handler.util";
// import { HttpResponse } from "../Constants/httpResponse";
// const mentorAuthorization = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const refreshToken = req.cookies?.authToken;
//     //checking fresh token valid
//     if (!refreshToken) {
//       res.status(Status.Unauthorized).json({
//         success: false,
//         message:  HttpResponse?.UNAUTHORIZED,
//       });
//       return;
//     }
//     //get access token from authorizatoin header
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer")) {
//       res
//         .status(Status.Unauthorized)
//         .json({
//           success: false,
//           message:  HttpResponse?.UNAUTHORIZED,
//           user: false,
//         });
//       return;
//     }
//     const token: string | undefined = authHeader?.split(" ")[1];
//     if (!token) {
//       res
//         .status(Status.Unauthorized)
//         .json({
//           success: false,
//           message: HttpResponse?.UNAUTHORIZED,
//           user: false,
//         });
//       return;
//     }
//     //jwt verifying
//     const decode = verifyAccessToken(token as string, "mentor");
//     if (decode?.error == "TokenExpired") {
//       res
//         .status(Status?.Forbidden)
//         .json({ success: false, message:  HttpResponse?.TOKEN_EXPIRED });
//       return;
//     }
//     if (decode?.result?.role !== "mentor"||!decode?.isValid) {
//       res
//         .status(Status?.Unauthorized)
//         .json({ success: false, message:  HttpResponse?.UNAUTHORIZED });
//       return;
//     }
//     if (decode?.error == "TamperedToken") {
//       res
//         .status(Status?.Unauthorized)
//         .json({ success: false, message:  HttpResponse?.UNAUTHORIZED });
//       return;
//     }
//     const mentorData = await mentorModel.findById(decode?.result?.userId);
//     if (!mentorData?.name || mentorData?.isBlocked) {
//       res
//         .status(Status.Unauthorized)
//         .json({
//           message: HttpResponse?.UNAUTHORIZED,
//           success: false,
//           user: false,
//         });
//       return;
//     }
//     req.user = new mongoose.Types.ObjectId(decode?.result?.userId as string);
//     next();
//   } catch (error: unknown) {
//     throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
//   }
// };
// export default mentorAuthorization;
