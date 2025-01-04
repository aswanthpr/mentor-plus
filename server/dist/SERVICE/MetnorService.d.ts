import { IMentorService } from "../INTERFACE/Mentor/IMentorService";
import { IMentorRepository } from "../INTERFACE/Mentor/IMentorRepository";
import { IMentor } from "../MODEL/mentorModel";
import { ICategoryRepository } from "../INTERFACE/Category/ICategoryRepository";
import { ICategory } from "../MODEL/categorySchema";
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
    blMentorEditProfile(mentorData: IMentor): Promise<IMentor | null>;
}
//# sourceMappingURL=MetnorService.d.ts.map