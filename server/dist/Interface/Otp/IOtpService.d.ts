export default interface IOtpService {
    sentOtptoMail(email: string): Promise<void>;
    BLVerifyOtp(email: string, otp: string, type?: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
//# sourceMappingURL=IOtpService.d.ts.map