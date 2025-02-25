import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, verifyRefreshToken } from "../Utils/jwt.utils";
import mentorModel from "../Model/mentorModel";
import mongoose from "mongoose";
import { Status } from "../Utils/httpStatusCode";



const mentorAuthorize = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            res.status(Status.Forbidden).json({ success: false, message: "Unauthorized. No token provided.", user: false })
            return 
        }

        const token: string | undefined = authHeader?.split(' ')[1];
        if (!token) {
            res.status(Status.Forbidden).json({ success: false, message: "You do not have permission to access this resource.", user: false });
             return
        }

        const decode = verifyAccessToken(token as string);


        if (!decode || !decode.userId) {
            res.status(Status.Forbidden).json({ success: false, message: "You do not have permission to access this resource.", user: false });
             return
        }

        const menteeData = await mentorModel.findById(decode?.userId);

        if (!menteeData || menteeData?.isBlocked) {
            res.status(Status.Forbidden).json({ message: 'You do not have permission to access this resource.', success: false, user: false });
            return

        }

         req.user  =  new mongoose.Types.ObjectId(decode?.userId as string) 

        next()
    } catch (error: unknown) {
        const refreshToken = req.cookies?.mentorToken;
        
            if (!refreshToken || !verifyRefreshToken(refreshToken)) {
              res.status(Status.Unauthorized).json({
                success: false,
                message: "You are not authorized. Please log in.",
              });
              return;
            }
            res.status(Status.Forbidden).json({
              success: false,
              message: "You do not have permission to access this resource.",
            });
            console.log(error instanceof Error ? error.message : String(error));
    }
}

export default mentorAuthorize;