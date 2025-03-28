import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongoose";
import { IchatController } from "../Interface/chat/IchatController";
import { IchatService } from "../Interface/chat/IchatService";


export class chatController implements IchatController {
    constructor(
       private  _chatService:IchatService 
    ){}
  async getChats(req: Request, res: Response,next: NextFunction): Promise<void> {
    try {
       
       const {result,message,status,success} = await this._chatService.getChats(req.user as Express.User as ObjectId,req.query.role as string)
      res.status(status).json({result,message,success,userId:req?.user});

    } catch (error: unknown) {
      next(error)
    }
  }
  // get user messages
  async getUserMessage(req: Request, res: Response,next: NextFunction): Promise<void> {
    try {
      const {chatId}  = req.query;
    
      const {message,result,status,success} = await this._chatService.getUserMessage(chatId as string);
      res.status(status).json({message,result,success});

    } catch (error:unknown) {
      next(error)
    }
  }
 
}
