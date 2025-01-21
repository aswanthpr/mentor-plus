import { IOtpRepository } from "../Interface/Otp/IOtpRepository";
import IOtpService from "../Interface/Otp/IOtpService";
import { IMenteeRepository } from "../Interface/Mentee/IMenteeRepository";
declare class OtpService implements IOtpService {
    private _OtpRespository;
    private _menteeRepository;
    constructor(_OtpRespository: IOtpRepository, _menteeRepository: IMenteeRepository);
    sentOtptoMail(email: string): Promise<void>;
    BLVerifyOtp(email: string, otp: string, type?: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
export default OtpService;
//# sourceMappingURL=OtpService.d.ts.map