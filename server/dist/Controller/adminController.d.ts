import { Request, Response } from "express";
import { IadminController } from "../Interface/Admin/IadminController";
import { IadminService } from "../Interface/Admin/IadminService";
export declare class adminController implements IadminController {
    private _AdminService;
    constructor(_AdminService: IadminService);
    getAdminRefreshToken(req: Request, res: Response): Promise<void>;
    getCreateCategory(req: Request, res: Response): Promise<void>;
    getCategoryData(req: Request, res: Response): Promise<void>;
    getEditCategory(req: Request, res: Response): Promise<void>;
    getChangeCategoryStatus(req: Request, res: Response): Promise<void>;
    getMenteeData(req: Request, res: Response): Promise<void>;
    getChangeMenteeStatus(req: Request, res: Response): Promise<void>;
    getEditMentee(req: Request, res: Response): Promise<void>;
    getAddMentee(req: Request, res: Response): Promise<void>;
    getMentorData(req: Request, res: Response): Promise<void>;
    getMentorVerify(req: Request, res: Response): Promise<void>;
    getChangeMentorStatus(req: Request, res: Response): Promise<void>;
    getAdminLogout(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=adminController.d.ts.map