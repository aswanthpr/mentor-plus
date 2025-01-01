import { IOtpRepository } from "../INTERFACE/Otp/IOtpRepository";
import { IOtp } from "../MODEL/otpModel";
declare class OtpRepository implements IOtpRepository {
    createOtp(email: string, otp: string): Promise<IOtp | undefined>;
    DBVerifyOtp(email: string, otp: string): Promise<IOtp | null>;
    DBupdateMentee(email: string): Promise<any>;
}
declare const _default: OtpRepository;
export default _default;
//# sourceMappingURL=OtpRepo.d.ts.map