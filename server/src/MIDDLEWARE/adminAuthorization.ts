import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import MenteeModel, { IMentee } from "../MODEL/MenteeModel";
import { verifyAccessToken } from "../UTILS/jwt.utils";


interface IAuthRequest extends Request {
    user?: {
        adminId: string | JwtPayload;
    }
}

const authorization = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise< void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            res.status(401).json({ success: false, message: "Unauthorized. No token provided." });
            return

        }
        const token: string | undefined = authHeader?.split(' ')[1];

        const decode = verifyAccessToken(token as string)
        const menteeData = await MenteeModel.findById(decode?.userId, {isAdmin:true});

        if (!menteeData) {
         res.status(403).json({ message: 'admin not found', success: false });
         return

        }

        console.log(decode, 'this midlle decode')
        if (!decode || !decode.userId) {
            res.status(401).json({ success: false, message: "Invalid token." });
             return
        }
        req.user  = { adminId: decode?.userId }
        next()
    } catch (error: unknown) {
        console.log(error instanceof Error ? error.message : String(error))
        res.status(403).json({ success: false, message: "Token expired or invalid." });
        return;
    }
}
 
export default authorization;