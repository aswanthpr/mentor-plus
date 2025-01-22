import { Iquestion } from "../../Model/questionModal";
import { Icategory } from "../../Model/categorySchema";
import { Imentor } from "../../Model/mentorModel";
export interface ImentorService {
    mentorProfile(token: string): Promise<{
        success: boolean;
        message: string;
        result: Imentor | null;
        status: number;
        categories: Icategory[] | [];
    }>;
    mentorRefreshToken(refresh: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        accessToken?: string;
        refreshToken?: string;
    }>;
    passwordChange(currentPassword: string, newPassword: string, id: string): Promise<{
        success: boolean;
        message: string;
        status: number;
    }>;
    mentorProfileImageChange(image: Express.Multer.File | null, id: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        profileUrl?: string;
    }>;
    mentorEditProfile(mentorData: Imentor, resume: Express.Multer.File | null): Promise<{
        success: boolean;
        message: string;
        status: number;
        result: Imentor | null;
    }>;
    homeData(filter: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        homeData: Iquestion[] | null;
    }>;
}
//# sourceMappingURL=iMentorService.d.ts.map