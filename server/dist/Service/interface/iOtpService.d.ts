export default interface IotpService {
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
//# sourceMappingURL=iOtpService.d.ts.map