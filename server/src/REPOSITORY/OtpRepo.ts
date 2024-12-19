import { IOtpRepository } from "../INTERFACE/Otp/IOtpRepository";
import otpModel,{ IOtp } from "../MODEL/otpModel";
import MenteeModel from "../MODEL/MenteeModel";

class OtpRepository implements IOtpRepository{


    async createOtp(email: string, otp: string):Promise<IOtp|undefined> {
        try {

            const saveOtp = new otpModel({ email,otp}); 
           const data=await saveOtp.save();
           console.log(data,'otp created')
            return data
        } catch (error:unknown) {
            throw new Error(`${'\x1b[35m%s\x1b[0m'}error while creating otp:${error instanceof Error?error.message:String(error)}`);
        }
        
    }
    async DBVerifyOtp(email: string, otp: string): Promise<IOtp|null> {
        try {
            const data = await otpModel.findOne({email,otp}).exec();
            console.log('OTP found in database:', data);
            return data
        } catch (error:unknown) {
        
            throw new Error(`error while find on database in verify otp  ${error instanceof Error ? error.message:String(error)}`)
        
        }
    }
    async DBupdateMentee(email: string): Promise<any> {
        try {
            const data =  await MenteeModel.updateOne({email},{$set:{verified:true}});
            console.log(data,'verify data from repo')
            return data
        } catch (error:unknown) {
        throw new Error(`error while updating mentee`)           
        }
    }
    
}   
export default new OtpRepository()