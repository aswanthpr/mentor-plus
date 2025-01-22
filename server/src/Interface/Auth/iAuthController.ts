import { Request, Response } from "express";

export interface IauthController {
    menteeSignup(req: Request, res: Response): Promise<void>
    verifyOtp(req: Request, res: Response): Promise<void>
    resendOtp(req: Request, res: Response): Promise<void>
    mainLogin(req: Request, res: Response): Promise<void>
    forgotPassword(req: Request, res: Response): Promise<void>
    forgot_PasswordChange(req: Request, res: Response): Promise<void>


    adminLogin(req: Request, res: Response): Promise<void>

    mentorFields(req: Request, res: Response): Promise<void>
    mentorApply(req: Request, res: Response): Promise<void>;
    mentorLogin(req: Request, res: Response): Promise<void>;
    mentorForgotPassword(req: Request, res: Response): Promise<void>;
    mentorForgot_PasswordChange(req: Request, res: Response): Promise<void>;

    googleAuth(req: Request, res: Response): Promise<void>;



}


