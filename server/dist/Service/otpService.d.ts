import { IotpRepository } from "../Interface/Otp/iOtpRepository";
import IotpService from "../Interface/Otp/iOtpService";
import { ImenteeRepository } from "../Interface/Mentee/iMenteeRepository";
declare class otpService implements IotpService {
    private _otpRespository;
    private _menteeRepository;
    constructor(_otpRespository: IotpRepository, _menteeRepository: ImenteeRepository);
    sentOtptoMail(email: string): Promise<{
        message: string;
        success: boolean;
        status: number;
    }>;
    verifyOtp(email: string, otp: string, type?: string): Promise<{
        success: boolean;
        message: string;
        status: number;
    }>;
}
export default otpService;
//# sourceMappingURL=otpService.d.ts.map