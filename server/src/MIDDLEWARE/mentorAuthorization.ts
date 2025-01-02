import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import MenteeModel, { IMentee } from "../MODEL/MenteeModel";
import { verifyAccessToken } from "../UTILS/jwt.utils";
import mentorModel from "../MODEL/mentorModel";


interface IAuthRequest extends Request {
    user?: {
        mentor: string | JwtPayload;
    }
}

const mentorAuthorize = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            res.status(403).json({ success: false, message: "Unauthorized. No token provided.", user: false })
            console.log('authHeader ')

        }

        const token: string | undefined = authHeader?.split(' ')[1];
        if (!token) {
            res.status(403).json({ success: false, message: "Invalid token.", user: false }); return
        }

        const decode = verifyAccessToken(token as string);
        console.log('funckedup')

        if (!decode || !decode.userId) {
            res.status(403).json({ success: false, message: "Invalid or malformed token.", user: false }); return
        }

        const menteeData = await mentorModel.findById(decode?.userId);

        if (!menteeData || menteeData?.isBlocked) {
            res.status(403).json({ message: '"Mentor not found or blocked.', success: false, user: false });
            return

        }


        console.log(decode, 'this midlle decode');
        req.user = {
            mentorId: decode.userId,
        };
        next()
    } catch (error: unknown) {
        res.status(403).json({ success: false, message: "Token expired or invalid." });
        console.log(error instanceof Error ? error.message : String(error));
        return;
    }
}

export default mentorAuthorize;