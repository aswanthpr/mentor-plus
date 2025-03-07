import { IotpRepository } from "../Interface/Otp/iOtpRepository";
import IotpService from "../Interface/Otp/iOtpService";
import { nodeMailer } from "../Utils/nodeMailer.util";
import {genOtp} from "../Utils/reusable.util";
import { ImenteeRepository } from "../Interface/Mentee/iMenteeRepository";  

class otpService implements IotpService {
  constructor(
    private _otpRespository: IotpRepository,
    private _menteeRepository: ImenteeRepository
  ) {}

  async sentOtptoMail(email: string): Promise<void> {
    try {
      const otp: string = genOtp();
      console.log(otp);
      await this._otpRespository.createOtp(email, otp);
     await nodeMailer(email, otp);
    
    } catch (error: unknown) {
      throw new Error(
        `Failed to send otp to mail ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async verifyOtp(
    email: string,
    otp: string,
    type?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log(email, otp, "88888", type);
      if (!email || !otp || !type) {
        return { success: false, message: "email or otp is missing" };
      }
      const data = await this._otpRespository.verifyOtp(email, otp);

      if (!data) {
        return { success: false, message: "OTP does not match" };
      }

      if (type == "signup") {
        const updateResult = await this._menteeRepository.updateMentee(
          data.email
        );
        if (!updateResult) {
          return {
            success: false,
            message: "User not found or already verified",
          };
        }
      }

      return { success: true, message: "Verified successfully" };
    } catch (error: unknown) {
      console.error("OTP verification error:", error);
      throw new Error(
        `Verification error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
export default otpService;
