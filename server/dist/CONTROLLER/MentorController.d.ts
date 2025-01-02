import { Request, Response } from "express";
import { IMentorController } from "../INTERFACE/Mentor/IMentorController";
import { IMentorService } from "../INTERFACE/Mentor/IMentorService";
export declare class MentorController implements IMentorController {
    private _mentorService;
    constructor(_mentorService: IMentorService);
    getMentorLogout(req: Request, res: Response): Promise<void>;
    getMentorProfile(req: Request, res: Response): Promise<void>;
    getMentorRefreshToken(req: Request, res: Response): Promise<void>;
    getProfilePasswordChange(req: Request, res: Response): Promise<void>;
    getMentorProfileImageChange(req: Request, res: Response): Promise<void>;
    getMentorEditProfile(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=MentorController.d.ts.map