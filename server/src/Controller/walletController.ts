import { ObjectId } from "mongoose";
import { IwalletController } from "../Interface/wallet/IwalletController";
import { IwalletService } from "../Interface/wallet/IwalletService";
import { Request,Response } from "express";

export class walletController implements IwalletController{
    constructor(
       private __walletService:IwalletService
    ){}
// mentee add money to wallet 
async addMoneyToWallet(req:Request,res:Response): Promise<void> {
    try {
        const {amount} = req.body;
        
        const response =await this.__walletService?.addMoenyToWallet(amount,req.user as Express.User as ObjectId);
res.json( response)
    } catch (error:unknown) {
        throw new Error(
            `error while add money to wallet ${error instanceof Error ? error.message : String(error)
            }`
          );
    }
}
async walletStripeWebHook(req: Request, res: Response): Promise<void> {
  try{
    const signature = req.headers["stripe-signature"] as string;

    await this.__walletService.walletStripeWebHook(signature, req.body as Buffer);
    res.status(200).json({ success: true });
  }catch(error: unknown) {
    throw new Error(
      `Error while  webhook config ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
//fetch wallet data
async getWalletData(req: Request, res: Response): Promise<void> {
  try {
    
    const {status,message,walletData,success} = await this.__walletService.getWalletData(req.user as Express.User as ObjectId);
    res.status(status).json({message,success,walletData});
  } catch (error:unknown){
    throw new Error(
      `Error while fetch walletData ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

async withdrawMentorEarnings(req: Request, res: Response): Promise<void>{
  try {
    const {amount} = req.body;

    const{message,status,result,success} = await this.__walletService.withdrawMentorEarnings(amount,req.user as Express.User as ObjectId);
console.log(result,success)
    res.status(status).json({message,success,result});
  } catch (error:unknown) {
    throw new Error(
      `Error while fetch walletData ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
}