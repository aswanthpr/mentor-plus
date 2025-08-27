import { HttpError } from "../../Utils/index";
import { IotpRepository } from "../interface/iOtpRepository";
import {otpSchema, Iotp } from "../../Model/index";
import { Status } from "../../Constants/httpStatusCode";

class otpRepository implements IotpRepository {
  async createOtp(email: string, otp: string): Promise<Iotp | undefined> {
    try {
      const saveOtp = new otpSchema({ email, otp });
      const data = await saveOtp.save();
  
      return data;
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
    }
  }

  async verifyOtp(email: string, otp: string): Promise<Iotp | null> {
    try {
      const data = await otpSchema.findOne({ email, otp }).exec();
    
      return data;
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
    }
  }
}
export default new otpRepository();
