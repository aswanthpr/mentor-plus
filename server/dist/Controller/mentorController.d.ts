import { Request, Response } from "express";
import { ImentorController } from "../Interface/Mentor/iMentorController";
import { ImentorService } from "../Interface/Mentor/iMentorService";
export declare class mentorController implements ImentorController {
    private _mentorService;
    constructor(_mentorService: ImentorService);
    mentorLogout(req: Request, res: Response): Promise<void>;
    mentorProfile(req: Request, res: Response): Promise<void>;
    mentorRefreshToken(req: Request, res: Response): Promise<void>;
    profilePasswordChange(req: Request, res: Response): Promise<void>;
    mentorProfileImageChange(req: Request, res: Response): Promise<void>;
    mentorEditProfile(req: Request, res: Response): Promise<void>;
    homeData(req: Request, res: Response): Promise<void>;
    createTimeSlots(req: Request, res: Response): Promise<void>;
    getTimeSlots(req: Request, res: Response): Promise<void>;
    removeTimeSlot(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=mentorController.d.ts.map