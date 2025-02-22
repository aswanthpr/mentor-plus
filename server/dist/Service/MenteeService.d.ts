import { IMenteeService } from "../Interface/Mentee/iMenteeService";
import { IMentee } from "../Model/menteeModel";
import { IMenteeRepository } from "../Interface/Mentee/iMenteeRepository";
import { IMentor } from "../Model/mentorModel";
import { IMentorRepository } from "../Interface/Mentor/IMentorRepository";
import { ICategoryRepository } from "../Interface/Category/ICategoryRepository";
import { ICategory } from "../Model/categorySchema";
export declare class MenteeService implements IMenteeService {
    private _menteeRepository;
    private _mentorRepository;
    private _categoryRepository;
    constructor(_menteeRepository: IMenteeRepository, _mentorRepository: IMentorRepository, _categoryRepository: ICategoryRepository);
    blMenteeProfile(refreshToken: string): Promise<{
        success: boolean;
        message: string;
        result: IMentee | null;
        status: number;
    }>;
    blEditMenteeProfile(formData: Partial<IMentee>): Promise<{
        success: boolean;
        message: string;
        result: IMentee | null;
        status: number;
    }>;
    blPasswordChange(currentPassword: string, newPassword: string, _id: string): Promise<{
        success: boolean;
        message: string;
        status: number;
    }>;
    blProfileChange(image: Express.Multer.File | null, id: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        profileUrl?: string;
    }>;
    BLRefreshToken(refresh: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        accessToken?: string;
        refreshToken?: string;
    }>;
    blExploreData(): Promise<{
        success: boolean;
        message: string;
        status: number;
        mentor?: IMentor[] | null;
        category?: ICategory[] | null;
        skills: IMentor[] | undefined;
    }>;
}
//# sourceMappingURL=MenteeService.d.ts.map