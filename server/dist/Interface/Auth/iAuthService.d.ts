import { ImentorApplyData, IuserDetailsHeader } from "../../Types";
import { Icategory } from "../../Model/categorySchema";
import { Imentee } from "../../Model/menteeModel";
import { MenteeDTO } from "../../dto/mentee/menteeDTO";
export default interface IauthService {
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
        role?: string;
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
    adminLogin(email: string, password: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        accessToken: string | null;
        refreshToken: string | null;
    }>;
    mentorFields(): Promise<{
        success: boolean;
        message: string;
        status: number;
        categories?: Icategory[];
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
    mentorForgot_PasswordChange(email: string, password: string): Promise<{
        success: boolean;
        message: string;
        status: number;
    }>;
    mentorForgotPassword(email: string): Promise<{
        success: boolean;
        message: string;
        status: number;
    }>;
    googleAuth(user: Imentee | undefined): Promise<{
        success: boolean;
        message: string;
        status: number;
        accessToken?: string;
        refreshToken?: string;
        user?: MenteeDTO;
    }>;
}
//# sourceMappingURL=iAuthService.d.ts.map