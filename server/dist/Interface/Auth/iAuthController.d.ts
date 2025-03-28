import { NextFunction, Request, Response } from "express";
export interface IauthController {
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
//# sourceMappingURL=iAuthController.d.ts.map