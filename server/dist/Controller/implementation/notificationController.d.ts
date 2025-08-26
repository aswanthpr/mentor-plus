import { NextFunction, Request, Response } from "express";
import { InotificationService } from "../../Service/interface/InotificationService";
import { InotificationController } from "../interface/InotificationController";
export declare class notificationController implements InotificationController {
    private readonly _notificationService;
    constructor(_notificationService: InotificationService);
    getNotification(req: Request, res: Response, next: NextFunction): Promise<void>;
    markAsReadNotif(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=notificationController.d.ts.map