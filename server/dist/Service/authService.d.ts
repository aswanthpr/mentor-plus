import { Imentee } from "../Model/menteeModel";
import { Icategory } from "../Model/categorySchema";
import IotpService from "../Interface/Otp/iOtpService";
import IauthService from "../Interface/Auth/iAuthService";
import { ImentorRepository } from "../Interface/Mentor/iMentorRepository";
import { IcategoryRepository } from "../Interface/Category/iCategoryRepository";
import { ImenteeRepository } from "../Interface/Mentee/iMenteeRepository";
import { ImentorApplyData } from "../Types";
import { InotificationRepository } from "../Interface/Notification/InotificationRepository";
export declare class authService implements IauthService {
    private _OtpService;
    private _categoryRepository;
    private _MentorRepository;
    private _MenteeRepository;
    private _notificationRepository;
    constructor(_OtpService: IotpService, _categoryRepository: IcategoryRepository, _MentorRepository: ImentorRepository, _MenteeRepository: ImenteeRepository, _notificationRepository: InotificationRepository);
    mentee_Signup(userData: Imentee): Promise<{
        success: boolean;
        message: string;
    }>;
    mainLogin(email: string, password: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        refreshToken?: string;
        accessToken?: string;
    }>;
    forgotPassword(email: string): Promise<{
        success: boolean;
        message: string;
    } | undefined>;
    forgot_PasswordChange(email: string, password: string): Promise<{
        success: boolean;
        message: string;
    } | undefined>;
    mentorFields(): Promise<{
        success: boolean;
        message: string;
        status: number;
        categories?: Icategory[];
    }>;
    adminLogin(email: string, password: string): Promise<{
        success: boolean;
        message: string;
        accessToken?: string;
        refreshToken?: string;
    } | undefined>;
    mentorApply(mentorData: ImentorApplyData): Promise<{
        success: boolean;
        message: string;
        status: number;
    }>;
    mentorLogin(email: string, password: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        refreshToken?: string;
        accessToken?: string;
    }>;
    mentorForgotPassword(email: string): Promise<{
        success: boolean;
        message: string;
    } | undefined>;
    mentorForgot_PasswordChange(email: string, password: string): Promise<{
        success: boolean;
        message: string;
    } | undefined>;
    googleAuth(user: Imentee): Promise<{
        success: boolean;
        message: string;
        status: number;
        accessToken?: string;
        refreshToken?: string;
    }>;
}
//# sourceMappingURL=authService.d.ts.map