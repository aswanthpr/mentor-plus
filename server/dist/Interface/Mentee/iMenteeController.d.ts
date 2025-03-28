import { NextFunction, Request, Response } from "express";
export interface ImenteeController {
    refreshToken(req: Request, res: Response, next: NextFunction): Promise<void>;
    menteeLogout(req: Request, res: Response, next: NextFunction): Promise<void>;
    menteeProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    menteeProfileEdit(req: Request, res: Response, next: NextFunction): Promise<void>;
    passwordChange(req: Request, res: Response, next: NextFunction): Promise<void>;
    profileChange(req: Request, res: Response, next: NextFunction): Promise<void>;
    exploreData(req: Request, res: Response, next: NextFunction): Promise<void>;
    homeData(req: Request, res: Response, next: NextFunction): Promise<void>;
    getSimilarMentors(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=iMenteeController.d.ts.map