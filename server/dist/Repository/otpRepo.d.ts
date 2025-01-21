import { IOtpRepository } from "../Interface/Otp/IOtpRepository";
import { IOtp } from "../Model/otpModel";
declare class OtpRepository implements IOtpRepository {
    createOtp(email: string, otp: string): Promise<IOtp | undefined>;
    DBVerifyOtp(email: string, otp: string): Promise<IOtp | null>;
}
declare const _default: OtpRepository;
export default _default;
//# sourceMappingURL=otpRepo.d.ts.map