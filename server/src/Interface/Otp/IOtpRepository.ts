
import { IOtp } from "../../Model/otpModel";


export interface IOtpRepository{
     createOtp(email:string,otp:string):Promise<IOtp|undefined>
     DBVerifyOtp(email:string,otp:string):Promise<IOtp|null>
   
}