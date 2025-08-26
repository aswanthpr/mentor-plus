import { IotpRepository } from "../interface/iOtpRepository";
import { Iotp } from "../../Model/otpModel";
declare class otpRepository implements IotpRepository {
    createOtp(email: string, otp: string): Promise<Iotp | undefined>;
    verifyOtp(email: string, otp: string): Promise<Iotp | null>;
}
declare const _default: otpRepository;
export default _default;
//# sourceMappingURL=otpRepo.d.ts.map