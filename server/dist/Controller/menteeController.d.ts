import { Request, Response } from "express";
import { ImenteeService } from "../Interface/Mentee/iMenteeService";
import { ImenteeController } from "../Interface/Mentee/iMenteeController";
export declare class menteeController implements ImenteeController {
    private _menteeService;
    constructor(_menteeService: ImenteeService);
    refreshToken(req: Request, res: Response): Promise<void>;
    menteeLogout(req: Request, res: Response): Promise<void>;
    menteeProfile(req: Request, res: Response): Promise<void>;
    menteeProfileEdit(req: Request, res: Response): Promise<void>;
    passwordChange(req: Request, res: Response): Promise<void>;
    profileChange(req: Request, res: Response): Promise<void>;
    exploreData(req: Request, res: Response): Promise<void>;
    homeData(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=menteeController.d.ts.map