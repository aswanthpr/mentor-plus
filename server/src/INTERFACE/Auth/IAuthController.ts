import { Request,Response } from "express";
import { IOtp } from "../../MODEL/otpModel";

export interface IAuthController {
    menteeSignup(req:Request,res:Response):Promise<void>
    getVerifyOtp(req:Request,res:Response):Promise<void>
    getResendOtp(req:Request,res:Response):Promise<void>
    getMainLogin(req:Request,res:Response):Promise<void>
    
} 