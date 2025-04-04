import { ObjectId } from "mongoose";
import { IwalletController } from "../Interface/wallet/IwalletController";
import { IwalletService } from "../Interface/wallet/IwalletService";
import { NextFunction, Request,Response } from "express";
import { Status } from "../Constants/httpStatusCode";

export class walletController implements IwalletController{
    constructor(
       private __walletService:IwalletService
    ){}
// mentee add money to wallet 
async addMoneyToWallet(req:Request,res:Response, next: NextFunction): Promise<void> {
    try {
        const {amount} = req.body;
        
        const response =await this.__walletService?.addMoenyToWallet(amount,req.user as Express.User as ObjectId);
res.json( response)
    } catch (error:unknown) {
      next(error)
    }
}
async walletStripeWebHook(req: Request, res: Response,next: NextFunction): Promise<void> {
  try{
    const signature = req.headers["stripe-signature"] as string;
    console.log(signature,req.body)

    await this.__walletService.walletStripeWebHook(signature, req.body as Buffer);
    res.status(Status?.Ok).json({ success: true });
  }catch(error: unknown) {
    next(error)
  }
}
//fetch wallet data
async getWalletData(req: Request, res: Response,next: NextFunction): Promise<void> {
  try {
    const {role,search,filter,page,limit} = req.query;

    const {status,message,walletData,success,totalPage} = await this.__walletService.getWalletData(req.user as Express.User as ObjectId,
      String(role),String(search),String(filter),Number(page),Number(limit)
    );
    res.status(status).json({message,success,walletData,totalPage});
  } catch (error:unknown){
    next(error)
  }
}

async withdrawMentorEarnings(req: Request, res: Response,next: NextFunction): Promise<void>{
  try {
    const {amount} = req.body;

    const{message,status,result,success} = await this.__walletService.withdrawMentorEarnings(amount,req.user as Express.User as ObjectId);

    res.status(status).json({message,success,result});
  } catch (error:unknown) {
    next(error)
  }
}
}