import { Request, Response } from "express";
import { IadminController } from "../Interface/Admin/iAdminController";
import { IadminService } from "../Interface/Admin/iAdminService";
export declare class adminController implements IadminController {
    private _adminService;
    constructor(_adminService: IadminService);
    adminRefreshToken(req: Request, res: Response): Promise<void>;
    createCategory(req: Request, res: Response): Promise<void>;
    categoryData(req: Request, res: Response): Promise<void>;
    editCategory(req: Request, res: Response): Promise<void>;
    changeCategoryStatus(req: Request, res: Response): Promise<void>;
    menteeData(req: Request, res: Response): Promise<void>;
    changeMenteeStatus(req: Request, res: Response): Promise<void>;
    editMentee(req: Request, res: Response): Promise<void>;
    addMentee(req: Request, res: Response): Promise<void>;
    mentorData(req: Request, res: Response): Promise<void>;
    mentorVerify(req: Request, res: Response): Promise<void>;
    changeMentorStatus(req: Request, res: Response): Promise<void>;
    adminLogout(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=adminController.d.ts.map