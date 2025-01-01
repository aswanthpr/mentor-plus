import { IMentee } from "../MODEL/MenteeModel";
import { IMentorApplyData } from "../TYPES/index";
import { ICategory } from "../MODEL/categorySchema";
import IOtpService from "../INTERFACE/Otp/IOtpService";
import IAuthService from "../INTERFACE/Auth/IAuthService";
import { IAuthRepository } from "../INTERFACE/Auth/IAuthRepository";
import { IMentorRepository } from "../INTERFACE/Mentor/IMentorRepository";
import { ICategoryRepository } from "../INTERFACE/Category/ICategoryRepository";
export declare class AuthService implements IAuthService {
    private _AuthRepository;
    private _OtpService;
    private _categoryRepository;
    private _MentorRepository;
    constructor(_AuthRepository: IAuthRepository, _OtpService: IOtpService, _categoryRepository: ICategoryRepository, _MentorRepository: IMentorRepository);
    mentee_Signup(userData: IMentee): Promise<{
        success: boolean;
        message: string;
    }>;
    BLMainLogin(email: string, password: string): Promise<{
        success: boolean;
        message: string;
        refreshToken?: string;
        accessToken?: string;
    }>;
    BLforgotPassword(email: string): Promise<{
        success: boolean;
        message: string;
    } | undefined>;
    BLforgot_PasswordChange(email: string, password: string): Promise<{
        success: boolean;
        message: string;
    } | undefined>;
    blMentorFields(): Promise<{
        success: boolean;
        message: string;
        status: number;
        categories?: ICategory[];
    }>;
    BLadminLogin(email: string, password: string): Promise<{
        success: boolean;
        message: string;
        accessToken?: string;
        refreshToken?: string;
    } | undefined>;
    blMentorApply(mentorData: IMentorApplyData): Promise<{
        success: boolean;
        message: string;
        status: number;
    }>;
    blMentorLogin(email: string, password: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        refreshToken?: string;
        accessToken?: string;
    }>;
    blMentorForgotPassword(email: string): Promise<{
        success: boolean;
        message: string;
    } | undefined>;
    blMentorForgot_PasswordChange(email: string, password: string): Promise<{
        success: boolean;
        message: string;
    } | undefined>;
    blGoogleAuth(): Promise<any>;
}
//# sourceMappingURL=AuthService.d.ts.map