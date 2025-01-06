import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import MenteeModel from "../MODEL/MenteeModel";
import { verifyAccessToken } from "../UTILS/jwt.utils";

interface IAuthenticatedRequest extends Request {
  user?: {
    userId: string | JwtPayload;
  };
}

const authorize = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      res
        .status(401)
        .json({
          success: false,
          message: "Unauthorized. No token provided.",
          user: true,
        });
      return;
    }
    const token: string | undefined = authHeader?.split(" ")[1];

    const decode = verifyAccessToken(token as string);
    if (!decode || !decode.userId) {
      res
        .status(401)
        .json({ success: false, message: "Invalid token.", user: true });
      return;
    }
    const menteeData = await MenteeModel.findById(decode?.userId);

    if (!menteeData || menteeData?.isBlocked) {
      res
        .status(403)
        .json({ message: "Mentee Not Found", success: false, user: false });
      return;
    }

    req.user = { userId: decode?.userId };
    next();
  } catch (error: unknown) {
    res
      .status(403)
      .json({ success: false, message: "Token expired or invalid." });
    console.log(error instanceof Error ? error.message : String(error));
    return;
  }
};

export default authorize;
