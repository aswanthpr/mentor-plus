import { Request,Response } from "express";


export interface IwalletController {
    addMoneyToWallet(req:Request,res:Response):Promise<void>;
    getWalletData(req:Request,res:Response):Promise<void>;
} 