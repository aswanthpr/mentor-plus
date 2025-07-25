import { Imentee } from "../Model/menteeModel";
import { Icategory } from "../Model/categorySchema";
import IotpService from "../Interface/Otp/iOtpService";
import IauthService from "../Interface/Auth/iAuthService";
import { ImentorRepository } from "../Interface/Mentor/iMentorRepository";
import { IcategoryRepository } from "../Interface/Category/iCategoryRepository";
import { ImenteeRepository } from "../Interface/Mentee/iMenteeRepository";
import { ImentorApplyData, IuserDetailsHeader } from "../Types";
import { InotificationRepository } from "../Interface/Notification/InotificationRepository";
import { MenteeDTO } from "../dto/mentee/menteeDTO";
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
        status: number;
    }>;
    mainLogin(email: string, password: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        refreshToken?: string;
        accessToken?: string;
        user?: IuserDetailsHeader;
    }>;
    forgotPassword(email: string): Promise<{
        success: boolean;
        message: string;
        status: number;
    } | undefined>;
    forgot_PasswordChange(email: string, password: string): Promise<{
        success: boolean;
        message: string;
        status: number;
    }>;
    mentorFields(): Promise<{
        success: boolean;
        message: string;
        status: number;
        categories?: Icategory[];
    }>;
    adminLogin(email: string, password: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        accessToken: string | null;
        refreshToken: string | null;
    }>;
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
        user?: IuserDetailsHeader;
    }>;
    mentorForgotPassword(email: string): Promise<{
        success: boolean;
        message: string;
        status: number;
    }>;
    mentorForgot_PasswordChange(email: string, password: string): Promise<{
        success: boolean;
        message: string;
        status: number;
    }>;
    googleAuth(user: Imentee): Promise<{
        success: boolean;
        message: string;
        status: number;
        accessToken?: string;
        refreshToken?: string;
        user?: MenteeDTO;
    }>;
}
//# sourceMappingURL=authService.d.ts.map