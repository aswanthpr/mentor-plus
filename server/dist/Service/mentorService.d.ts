import { ImentorService } from "../Interface/Mentor/iMentorService";
import { ImentorRepository } from "../Interface/Mentor/iMentorRepository";
import { Imentor } from "../Model/mentorModel";
import { IcategoryRepository } from "../Interface/Category/iCategoryRepository";
import { Icategory } from "../Model/categorySchema";
import { IquestionRepository } from "src/Interface/Qa/IquestionRepository";
import { Iquestion } from "src/Model/questionModal";
export declare class mentorService implements ImentorService {
    private _mentorRepository;
    private _categoryRepository;
    private _questionRepository;
    constructor(_mentorRepository: ImentorRepository, _categoryRepository: IcategoryRepository, _questionRepository: IquestionRepository);
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
    mentorEditProfile(mentorData: Imentor, resume: Express.Multer.File): Promise<{
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
//# sourceMappingURL=mentorService.d.ts.map