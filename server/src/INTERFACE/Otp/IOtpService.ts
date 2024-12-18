import { IOtp } from "../../MODEL/otpModel";

export default  interface IOtpService{
    sentOtptoMail(email:string):Promise<void>
    BLVerifyOtp(email:string,otp:string):Promise<{success:boolean,message:string}>
}