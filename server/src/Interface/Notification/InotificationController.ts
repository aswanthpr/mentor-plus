import { Request,Response } from "express"

export interface InotificationController{
  getNotification(req:Request,res:Response):Promise<void>;
  markAsReadNotif(req:Request,res:Response):Promise<void>;
}