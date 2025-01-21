import { IMentee } from "../Model/menteeModel";
import { ICategory } from "../Model/categorySchema";
import IOtpService from "../Interface/Otp/IOtpService";
import IAuthService from "../Interface/Auth/IAuthService";
import { IMentorRepository } from "../Interface/Mentor/IMentorRepository";
import { ICategoryRepository } from "../Interface/Category/ICategoryRepository";
import { IMenteeRepository } from "../Interface/Mentee/iMenteeRepository";
import { IMentorApplyData } from "src/Types";
export declare class AuthService implements IAuthService {
    private _OtpService;
    private _categoryRepository;
    private _MentorRepository;
    private _MenteeRepository;
    constructor(_OtpService: IOtpService, _categoryRepository: ICategoryRepository, _MentorRepository: IMentorRepository, _MenteeRepository: IMenteeRepository);
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
    blGoogleAuth(user: IMentee): Promise<{
        success: boolean;
        message: string;
        status: number;
        accessToken?: string;
        refreshToken?: string;
    }>;
}
//# sourceMappingURL=authService.d.ts.map