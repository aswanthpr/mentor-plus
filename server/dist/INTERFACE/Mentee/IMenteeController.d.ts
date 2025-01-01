import { Request, Response } from 'express';
export interface IMenteeController {
    getRefreshToken(req: Request, res: Response): Promise<void>;
    getMenteeLogout(req: Request, res: Response): Promise<void>;
    getMeneeProfile(req: Request, res: Response): Promise<void>;
    getMenteeProfileEdit(req: Request, res: Response): Promise<void>;
    getPasswordChange(req: Request, res: Response): Promise<void>;
    getProfileChange(req: Request, res: Response): Promise<void>;
    getExploreData(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=IMenteeController.d.ts.map