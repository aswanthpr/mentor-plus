import { Iotp } from "../../Model/otpModel";
export interface IotpRepository {
    createOtp(email: string, otp: string): Promise<Iotp | undefined>;
    verifyOtp(email: string, otp: string): Promise<Iotp | null>;
}
//# sourceMappingURL=iOtpRepository.d.ts.map