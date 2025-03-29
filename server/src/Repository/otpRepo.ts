import { HttpError } from "../Utils/http-error-handler.util";
import { IotpRepository } from "../Interface/Otp/iOtpRepository";
import otpModel, { Iotp } from "../Model/otpModel";
import { Status } from "../Constants/httpStatusCode";

class otpRepository implements IotpRepository {
  async createOtp(email: string, otp: string): Promise<Iotp | undefined> {
    try {
      const saveOtp = new otpModel({ email, otp });
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
      const data = await otpModel.findOne({ email, otp }).exec();
    
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
