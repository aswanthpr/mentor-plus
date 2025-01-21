import { Request, Response, NextFunction } from "express";
import MenteeModel from "../Model/menteeModel";
import { verifyAccessToken, verifyRefreshToken } from "../Utils/jwt.utils";



const authorization = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise< void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            res.status(403).json({ success: false, message: "Unauthorized. No token provided." });
            return

        }
        const token: string | undefined = authHeader?.split(' ')[1];

        const decode = verifyAccessToken(token as string)
        if (!decode || !decode.userId) {
            res.status(403).json({ success: false, message: "Invalid token." });
             return
        }
        const menteeData = await MenteeModel.findById(decode?.userId, {isAdmin:true});

        if (!menteeData) {
         res.status(403).json({ message: 'admin not found', success: false });
         return

        }

       
        req.user  = { adminId: decode?.userId }
        next()
    } catch (error: unknown) {
            const refreshToken = req.cookies?.adminToken;
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
            console.log(`\x1b[35m%s\x1b[0m`,error instanceof Error ? error.message : String(error));
    }
}
 
export default authorization;