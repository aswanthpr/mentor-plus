import { Request, Response } from "express";
import { IAdminController } from "../INTERFACE/Admin/IAdminController";
import { IAdminService } from "../INTERFACE/Admin/IAdminService";
export declare class AdminController implements IAdminController {
    private _AdminService;
    constructor(_AdminService: IAdminService);
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
//# sourceMappingURL=AdminController.d.ts.map