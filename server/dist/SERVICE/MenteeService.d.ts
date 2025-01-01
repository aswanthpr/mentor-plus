import { IMenteeService } from "../INTERFACE/Mentee/IMenteeService";
import { IMentee } from "../MODEL/MenteeModel";
import { IMenteeRepository } from "../INTERFACE/Mentee/IMenteeRepository";
import { IMentor } from "../MODEL/mentorModel";
import { IMentorRepository } from "../INTERFACE/Mentor/IMentorRepository";
import { ICategoryRepository } from "../INTERFACE/Category/ICategoryRepository";
export declare class MenteeService implements IMenteeService {
    private _menteeRepository;
    private _mentorRespository;
    private _categoryRepository;
    constructor(_menteeRepository: IMenteeRepository, _mentorRespository: IMentorRepository, _categoryRepository: ICategoryRepository);
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
        mentor?: IMentor | null;
        category?: ICategory | null;
    }>;
}
//# sourceMappingURL=MenteeService.d.ts.map