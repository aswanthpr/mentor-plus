import { NextFunction, Request, Response } from "express";
import { ImentorController } from "../interface/iMentorController";
import { ImentorService } from "../../Service/interface/iMentorService";
export declare class mentorController implements ImentorController {
    private _mentorService;
    constructor(_mentorService: ImentorService);
    mentorLogout(req: Request, res: Response, next: NextFunction): Promise<void>;
    mentorProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    mentorRefreshToken(req: Request, res: Response, next: NextFunction): Promise<void>;
    profilePasswordChange(req: Request, res: Response, next: NextFunction): Promise<void>;
    mentorProfileImageChange(req: Request, res: Response, next: NextFunction): Promise<void>;
    mentorEditProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    questionData(req: Request, res: Response, next: NextFunction): Promise<void>;
    createTimeSlots(req: Request, res: Response, next: NextFunction): Promise<void>;
    getTimeSlots(req: Request, res: Response, next: NextFunction): Promise<void>;
    removeTimeSlot(req: Request, res: Response, next: NextFunction): Promise<void>;
    chartData(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=mentorController.d.ts.map