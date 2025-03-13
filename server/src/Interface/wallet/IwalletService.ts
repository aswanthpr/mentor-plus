import { ObjectId } from "mongoose";
import { Itransaction } from "src/Model/transactionModel";
import { Iwallet } from "src/Model/walletModel";
import Stripe from "stripe";

export interface IwalletService {
    addMoenyToWallet(amount:number,userId:ObjectId):Promise<{message:string,status:number,success:boolean,session?:Stripe.Response<Stripe.Checkout.Session>}|undefined>;
    walletStripeWebHook (signature:string|Buffer,bodyData:Buffer):Promise<void>;
    getWalletData(userId:ObjectId):Promise<{message:string,status:number,success:boolean,walletData:Iwallet|null}>;
    withdrawMentorEarnings(amount:number,userId:ObjectId): Promise<{message:string,status:number,success:boolean,result:Itransaction|null}>
}