import { NextFunction, Request,Response } from "express"

export interface InotificationController{
  getNotification(req:Request,res:Response,next: NextFunction):Promise<void>;
  markAsReadNotif(req:Request,res:Response,next: NextFunction):Promise<void>;
}