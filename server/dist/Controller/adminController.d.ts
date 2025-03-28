import { NextFunction, Request, Response } from "express";
import { IadminController } from "../Interface/Admin/iAdminController";
import { IadminService } from "../Interface/Admin/iAdminService";
export declare class adminController implements IadminController {
    private _adminService;
    constructor(_adminService: IadminService);
    adminRefreshToken(req: Request, res: Response, next: NextFunction): Promise<void>;
    createCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
    categoryData(req: Request, res: Response, next: NextFunction): Promise<void>;
    editCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
    changeCategoryStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    menteeData(req: Request, res: Response, next: NextFunction): Promise<void>;
    changeMenteeStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    editMentee(req: Request, res: Response, next: NextFunction): Promise<void>;
    addMentee(req: Request, res: Response, next: NextFunction): Promise<void>;
    mentorData(req: Request, res: Response, next: NextFunction): Promise<void>;
    mentorVerify(req: Request, res: Response, next: NextFunction): Promise<void>;
    changeMentorStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    adminLogout(req: Request, res: Response, next: NextFunction): Promise<void>;
    getDashboardData(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=adminController.d.ts.map