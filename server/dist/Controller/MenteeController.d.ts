import { Request, Response } from "express";
import { IMenteeService } from "../Interface/Mentee/iMenteeService";
import { IMenteeController } from "../Interface/Mentee/iMenteeController";
export declare class MenteeController implements IMenteeController {
    private _menteeService;
    constructor(_menteeService: IMenteeService);
    getRefreshToken(req: Request, res: Response): Promise<void>;
    getMenteeLogout(req: Request, res: Response): Promise<void>;
    getMenteeProfile(req: Request, res: Response): Promise<void>;
    getMenteeProfileEdit(req: Request, res: Response): Promise<void>;
    getPasswordChange(req: Request, res: Response): Promise<void>;
    getProfileChange(req: Request, res: Response): Promise<void>;
    getExploreData(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=MenteeController.d.ts.map