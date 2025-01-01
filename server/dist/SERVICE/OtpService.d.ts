import { IOtpRepository } from "../INTERFACE/Otp/IOtpRepository";
import IOtpService from "../INTERFACE/Otp/IOtpService";
import { IMentorRepository } from "../INTERFACE/Mentor/IMentorRepository";
declare class OtpService implements IOtpService {
    private _OtpRespository;
    private _MentorRepository;
    constructor(_OtpRespository: IOtpRepository, _MentorRepository: IMentorRepository);
    sentOtptoMail(email: string): Promise<void>;
    BLVerifyOtp(email: string, otp: string, user: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
export default OtpService;
//# sourceMappingURL=OtpService.d.ts.map