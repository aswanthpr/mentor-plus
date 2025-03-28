import { NextFunction, Request, Response } from "express";
import { InotificationService } from "../Interface/Notification/InotificationService";
import { InotificationController } from "../Interface/Notification/InotificationController";
export declare class notificationController implements InotificationController {
    private readonly _notificationService;
    constructor(_notificationService: InotificationService);
    getNotification(req: Request, res: Response, next: NextFunction): Promise<void>;
    markAsReadNotif(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=notificationController.d.ts.map