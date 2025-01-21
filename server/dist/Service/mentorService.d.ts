import { IMentorService } from "../Interface/Mentor/IMentorService";
import { IMentorRepository } from "../Interface/Mentor/IMentorRepository";
import { IMentor } from "../Model/mentorModel";
import { ICategoryRepository } from "../Interface/Category/ICategoryRepository";
import { ICategory } from "../Model/categorySchema";
import { IquestionRepository } from "src/Interface/Qa/IquestionRepository";
import { Iquestion } from "src/Model/questionModal";
export declare class MentorService implements IMentorService {
    private _MentorRepository;
    private _CategoryRepository;
    private _questionRepository;
    constructor(_MentorRepository: IMentorRepository, _CategoryRepository: ICategoryRepository, _questionRepository: IquestionRepository);
    blMentorProfile(token: string): Promise<{
        success: boolean;
        message: string;
        result: IMentor | null;
        status: number;
        categories: ICategory[] | [];
    }>;
    blMentorRefreshToken(refresh: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        accessToken?: string;
        refreshToken?: string;
    }>;
    blPasswordChange(currentPassword: string, newPassword: string, id: string): Promise<{
        success: boolean;
        message: string;
        status: number;
    }>;
    blMentorProfileImageChange(image: Express.Multer.File | null, id: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        profileUrl?: string;
    }>;
    blMentorEditProfile(mentorData: IMentor, resume: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        status: number;
        result: IMentor | null;
    }>;
    getHomeData(filter: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        homeData: Iquestion[] | null;
    }>;
}
//# sourceMappingURL=mentorService.d.ts.map