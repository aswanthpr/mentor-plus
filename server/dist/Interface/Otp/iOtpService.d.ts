export default interface IotpService {
    sentOtptoMail(email: string): Promise<void>;
    verifyOtp(email: string, otp: string, type?: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
//# sourceMappingURL=iOtpService.d.ts.map