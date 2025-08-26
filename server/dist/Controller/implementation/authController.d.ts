import { NextFunction, Request, Response } from "express";
import { IauthController } from "../interface/iAuthController";
import IauthService from "../../Service/interface/iAuthService";
import IotpService from "../../Service/interface/iOtpService";
export declare class authController implements IauthController {
    private _AuthService;
    private _OtpService;
    constructor(_AuthService: IauthService, _OtpService: IotpService);
    menteeSignup(req: Request, res: Response, next: NextFunction): Promise<void>;
    verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
    resendOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
    mainLogin(req: Request, res: Response, next: NextFunction): Promise<void>;
    forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
    forgot_PasswordChange(req: Request, res: Response, next: NextFunction): Promise<void>;
    adminLogin(req: Request, res: Response, next: NextFunction): Promise<void>;
    mentorFields(req: Request, res: Response, next: NextFunction): Promise<void>;
    mentorApply(req: Request, res: Response, next: NextFunction): Promise<void>;
    mentorLogin(req: Request, res: Response, next: NextFunction): Promise<void>;
    mentorForgotPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
    mentorForgot_PasswordChange(req: Request, res: Response, next: NextFunction): Promise<void>;
    googleAuth(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=authController.d.ts.map