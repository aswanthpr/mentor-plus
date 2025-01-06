import { Request, Response } from "express";
import { IAuthController } from "../INTERFACE/Auth/IAuthController";
import IAuthService from "../INTERFACE/Auth/IAuthService";
import IOtpService from "../INTERFACE/Otp/IOtpService";
export declare class AuthController implements IAuthController {
    private _AuthService;
    private _OtpService;
    constructor(_AuthService: IAuthService, _OtpService: IOtpService);
    menteeSignup(req: Request, res: Response): Promise<void>;
    getVerifyOtp(req: Request, res: Response): Promise<void>;
    getResendOtp(req: Request, res: Response): Promise<void>;
    getMainLogin(req: Request, res: Response): Promise<void>;
    getForgotPassword(req: Request, res: Response): Promise<void>;
    getForgot_PasswordChange(req: Request, res: Response): Promise<void>;
    getAdminLogin(req: Request, res: Response): Promise<void>;
    getMentorFields(req: Request, res: Response): Promise<void>;
    getMentorApply(req: Request, res: Response): Promise<void>;
    getMentorLogin(req: Request, res: Response): Promise<void>;
    getMentorForgotPassword(req: Request, res: Response): Promise<void>;
    getMentorForgot_PasswordChange(req: Request, res: Response): Promise<void>;
    getGoogleAuth(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=AuthController.d.ts.map