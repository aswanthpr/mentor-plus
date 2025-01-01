import { ICategoryRepository } from "../INTERFACE/Category/ICategoryRepository";
import { IAdminService } from "../INTERFACE/Admin/IAdminService";
import { ICategory } from "../MODEL/categorySchema";
import { IMenteeRepository } from "../INTERFACE/Mentee/IMenteeRepository";
import { IMentee } from "../MODEL/MenteeModel";
import { IMentor } from "../MODEL/mentorModel";
import { IMentorRepository } from "../INTERFACE/Mentor/IMentorRepository";
export declare class AdminService implements IAdminService {
    private _CategoryRepository;
    private _MenteeRepository;
    private _MentorRepository;
    constructor(_CategoryRepository: ICategoryRepository, _MenteeRepository: IMenteeRepository, _MentorRepository: IMentorRepository);
    BLAdminRefreshToken(refresh: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        accessToken?: string;
        refreshToken?: string;
    }>;
    blCreateCategory(Data: {
        category: string;
    }): Promise<{
        success: boolean;
        message: string;
        result?: ICategory;
        status: number;
    }>;
    blCategoryData(): Promise<{
        success: boolean;
        message: string;
        categories?: ICategory[];
    }>;
    blEditCategory(id: string, category: string): Promise<{
        success: boolean;
        message: string;
    }>;
    blChangeCategoryStatus(id: string): Promise<{
        success: boolean;
        message: string;
        status: number;
    }>;
    blMenteeData(): Promise<{
        success: boolean;
        message: string;
        status: number;
        Data?: IMentee[];
    }>;
    blChangeMenteeStatus(id: string): Promise<{
        success: boolean;
        message: string;
        status: number;
    }>;
    blEditMentee(formData: Partial<IMentee>): Promise<{
        success: boolean;
        message: string;
        status?: number;
    }>;
    blAddMentee(formData: Partial<IMentee>): Promise<{
        success: boolean;
        message: string;
        status?: number;
        mentee?: IMentee | null;
    }>;
    blMentorData(): Promise<{
        success: boolean;
        message: string;
        status: number;
        mentorData: IMentor[] | [];
    }>;
    blMentorVerify(id: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        result: IMentor | null;
    }>;
    blMentorStatusChange(id: string): Promise<{
        success: boolean;
        message: string;
        status: number;
    }>;
}
//# sourceMappingURL=AdminService.d.ts.map