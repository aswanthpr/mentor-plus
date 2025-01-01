import { ObjectId } from "mongoose";
import { IOtpRepository } from "../INTERFACE/Otp/IOtpRepository";
import IOtpService from "../INTERFACE/Otp/IOtpService";
import MenteeModel from "../MODEL/MenteeModel";
import { IOtp } from "../MODEL/otpModel";
import { nodeMailer } from "../UTILS/nodemailer.util";
import genOtp from "../UTILS/otpGen.util";
import { IMentorRepository } from "../INTERFACE/Mentor/IMentorRepository";


class OtpService implements IOtpService {
    constructor(private _OtpRespository: IOtpRepository, private _MentorRepository: IMentorRepository) { }

    async sentOtptoMail(email: string): Promise<void> {
        try {
            const otp: string = genOtp();
            console.log(otp)
            await this._OtpRespository.createOtp(email, otp);
            await nodeMailer(email, otp)
        } catch (error: unknown) {
            throw new Error(`Failed to send otp to mail1${error instanceof Error ? error.message : String(error)}`)
        }
    }

    async BLVerifyOtp(email: string, otp: string, user: string): Promise<{ success: boolean, message: string }> {
        try {
            console.log(email, otp, '88888')
            if (!email || !otp || !user) {
                return { success: false, message: 'email or otp is missing' };

            }
            const data = await this._OtpRespository.DBVerifyOtp(email, otp);
          
            if (!data) {
                return { success: false, message: 'OTP does not match' };

            }

            if (user == 'mentee') {
                const updateResult = await this._OtpRespository.DBupdateMentee(data.email);
                if (updateResult.modifiedCount === 1) {
                    return { success: false, message: 'User not found or already verified' };
                }
            }

            return { success: true, message: 'user validate successfully' };
        } catch (error: unknown) {
            console.error('OTP verification error:', error);
            throw new Error(`Verification error: ${error instanceof Error ? error.message : String(error)}`)
        }
    }
}
export default OtpService


