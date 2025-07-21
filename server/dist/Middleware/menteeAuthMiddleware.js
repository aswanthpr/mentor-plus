"use strict";
// import { Request, Response, NextFunction } from "express";
// import menteeModel from "../Model/menteeModel";
// import { verifyAccessToken } from "../Utils/jwt.utils";
// import mongoose from "mongoose";
// import { Status } from "../Constants/httpStatusCode";
// import { HttpError } from "../Utils/http-error-handler.util";
// import { HttpResponse } from "../Constants/httpResponse";
// const menteeAuthorization = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const refreshToken = req.cookies?.refreshToken;
//     //checking fresh token valid
//     if (!refreshToken) {
//       res.status(Status?.Unauthorized).json({
//         success: false,
//         message:  HttpResponse?.UNAUTHORIZED,
//       });
//       return;
//     }
//     //get access token from authorizatoin header
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer")) {
//       res.status(Status?.Unauthorized).json({
//         success: false,
//         message:  HttpResponse?.UNAUTHORIZED,
//       });
//       return;
//     }
//     const token: string | undefined = authHeader?.split(" ")[1];
//     if (!token) {
//       res
//         .status(Status.Unauthorized)
//         .json({
//           success: false,
//           message:  HttpResponse?.UNAUTHORIZED,
//           user: false,
//         });
//       return;
//     }
//     //jwt verifying
//     const decode = verifyAccessToken(token as string, "mentee");
//     if (decode?.error == "TokenExpired") {
//       res
//         .status(Status?.Forbidden)
//         .json({ success: false, message:  HttpResponse?.TOKEN_EXPIRED });
//       return;
//     }
//     if (decode?.result?.role !== "mentee"||!decode?.isValid) {
//       res
//         .status(Status?.Unauthorized)
//         .json({ success: false, message:  HttpResponse?.UNAUTHORIZED });
//       return;
//     }
//     if (decode?.error == "TamperedToken") {
//       res
//         .status(Status?.Unauthorized)
//         .json({ success: false, message: HttpResponse?.UNAUTHORIZED });
//       return;
//     }
//     const menteeData = await menteeModel.findById(decode?.result?.userId);
//     if (!menteeData || menteeData?.isBlocked) {
//       res
//         .status(Status?.Unauthorized)
//         .json({ message:  HttpResponse?.UNAUTHORIZED, success: false });
//       return;
//     }
//     req.user = new mongoose.Types.ObjectId(decode?.result?.userId as string);
//     next();
//   } catch (error: unknown) {
//     throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
//   }
// };
// export default menteeAuthorization;
