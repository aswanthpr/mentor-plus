import { NextFunction, Request, Response } from "express";
import { ImenteeService } from "../Interface/Mentee/iMenteeService";
import { ImenteeController } from "../Interface/Mentee/iMenteeController";
export declare class menteeController implements ImenteeController {
    private _menteeService;
    constructor(_menteeService: ImenteeService);
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
//# sourceMappingURL=menteeController.d.ts.map