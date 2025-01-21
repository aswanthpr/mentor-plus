import { IMentorService } from "../Interface/Mentor/IMentorService";
import { IMentorRepository } from "../Interface/Mentor/IMentorRepository";
import { IMentor } from "../Model/mentorModel";
import { ICategoryRepository } from "../Interface/Category/ICategoryRepository";
import { ICategory } from "../Model/categorySchema";
export declare class MentorService implements IMentorService {
    private _MentorRepository;
    private _CategoryRepository;
    constructor(_MentorRepository: IMentorRepository, _CategoryRepository: ICategoryRepository);
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
}
//# sourceMappingURL=MentorService.d.ts.map