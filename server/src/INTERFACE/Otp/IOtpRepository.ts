import { ObjectId } from "mongoose";
import { IOtp } from "../../MODEL/otpModel";


export interface IOtpRepository{
     createOtp(email:string,otp:string):Promise<IOtp|undefined>
     DBVerifyOtp(email:string,otp:string):Promise<IOtp|null>
   
}