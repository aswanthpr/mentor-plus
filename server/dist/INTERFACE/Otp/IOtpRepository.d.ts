import { IOtp } from "../../MODEL/otpModel";
export interface IOtpRepository {
    createOtp(email: string, otp: string): Promise<IOtp | undefined>;
    DBVerifyOtp(email: string, otp: string): Promise<IOtp | null>;
    DBupdateMentee(email: string): Promise<any>;
}
//# sourceMappingURL=IOtpRepository.d.ts.map