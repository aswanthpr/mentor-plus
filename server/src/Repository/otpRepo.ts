import { IotpRepository } from "../Interface/Otp/iOtpRepository";
import otpModel, { Iotp } from "../Model/otpModel";

class otpRepository implements IotpRepository {


    async createOtp(email: string, otp: string): Promise<Iotp | undefined> {
        try {

            const saveOtp = new otpModel({ email, otp });
            const data = await saveOtp.save();
            console.log(data, 'otp created')
            return data
        } catch (error: unknown) {
            throw new Error(`${'\x1b[35m%s\x1b[0m'}error while creating otp:${error instanceof Error ? error.message : String(error)}`);
        }

    }

    async verifyOtp(email: string, otp: string): Promise<Iotp | null> {
        try {
            const data = await otpModel.findOne({ email, otp }).exec();
            console.log('OTP found in database:', data);
            return data
        } catch (error: unknown) {

            throw new Error(`error while find on database in verify otp  ${error instanceof Error ? error.message : String(error)}`)

        }
    }


}
export default new otpRepository()