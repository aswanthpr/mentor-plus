import { Request, Response } from 'express';
export interface ImenteeController {
    refreshToken(req: Request, res: Response): Promise<void>;
    menteeLogout(req: Request, res: Response): Promise<void>;
    menteeProfile(req: Request, res: Response): Promise<void>;
    menteeProfileEdit(req: Request, res: Response): Promise<void>;
    passwordChange(req: Request, res: Response): Promise<void>;
    profileChange(req: Request, res: Response): Promise<void>;
    exploreData(req: Request, res: Response): Promise<void>;
    homeData(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=iMenteeController.d.ts.map