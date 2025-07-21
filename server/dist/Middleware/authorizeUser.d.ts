import { Request, Response, NextFunction } from "express";
import { Model } from "mongoose";
declare const modelMap: Record<string, Model<any>>;
declare const authorizeUser: (role: keyof typeof modelMap) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default authorizeUser;
//# sourceMappingURL=authorizeUser.d.ts.map