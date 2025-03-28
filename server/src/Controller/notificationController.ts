import { NextFunction, Request, Response } from "express";
import { InotificationService } from "../Interface/Notification/InotificationService";
import { InotificationController } from "../Interface/Notification/InotificationController";
import { ObjectId } from "mongoose";

export class notificationController implements InotificationController {
  constructor(private readonly _notificationService: InotificationService) {}
  async getNotification(req: Request, res: Response,next: NextFunction): Promise<void> {
    try {
     
      const {status,message,success,result} = await this._notificationService.getNotification(
        req.user as Express.User as ObjectId
      );
    
      res.status(status).json({ success,message,result });
    } catch (error: unknown) {
      next(error)
    }
  }

  async markAsReadNotif(req: Request, res: Response,next: NextFunction): Promise<void> {
    try {
      const {notificationId} = req.params;

      const {message,status,success} = await this._notificationService.markAsReadNotification(notificationId,req.user as Express.User as ObjectId)

      res.status(status).json({message,success});
    } catch (error:unknown) {
      next(error)
    }
  }

}
