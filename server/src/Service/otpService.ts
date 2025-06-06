import { IotpRepository } from "../Interface/Otp/iOtpRepository";
import IotpService from "../Interface/Otp/iOtpService";
import {sendMail } from "../Utils/nodeMailer.util";
import { genOtp } from "../Utils/reusable.util";
import { ImenteeRepository } from "../Interface/Mentee/iMenteeRepository";

import { HttpResponse } from "../Constants/httpResponse";
import { Status } from "../Constants/httpStatusCode";
import { HttpError } from "../Utils/http-error-handler.util";
import { generateOtpEmailTemplate } from "../Utils/email.template.util";

class otpService implements IotpService {
  constructor(
    private _otpRespository: IotpRepository,
    private _menteeRepository: ImenteeRepository
  ) { }

  async sentOtptoMail(
    email: string
  ): Promise<{ message: string; success: boolean; status: number }> {
    try {
      if (!email) {
        return {
          message: HttpResponse?.INVALID_CREDENTIALS,
          success: false,
          status: Status?.BadRequest,
        };
      }
      const otp: string = genOtp();
     
      const result = await this._otpRespository.createOtp(email, otp);
      if (!result?.otp) {
        return {
          message: HttpResponse?.INVALID_CREDENTIALS,
          success: false,
          status: Status?.Ok,
        };
      }
      const mailOptions = generateOtpEmailTemplate(otp,email);
      await sendMail({...mailOptions});
      return {
        message: HttpResponse?.OTP_SEND_TO_MAIL,
        success: true,
        status: Status?.Ok,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }

  async verifyOtp(
    email: string,
    otp: string,
    type?: string
  ): Promise<{ success: boolean; message: string; status: number }> {
    try {
    
      if (!email || !otp || !type) {
        return {
          success: false,
          message: "email or otp is missing",
          status: Status?.BadRequest,
        };
      }
      const data = await this._otpRespository.verifyOtp(email, otp);

      if (!data) {
        return {
          success: false,
          message: "OTP does not match",
          status: Status?.BadRequest,
        };
      }

      if (type == "signup") {
        const updateResult = await this._menteeRepository.updateMentee(
          data.email
        );
        if (!updateResult) {
          return {
            success: false,
            message: "User not found or already verified",
            status: Status?.NotFound,
          };
        }
      }

      return {
        success: true,
        message: "Verified successfully",
        status: Status?.Ok,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
}
export default otpService;
