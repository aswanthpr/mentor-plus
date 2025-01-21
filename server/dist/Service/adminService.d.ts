import { ICategoryRepository } from "../Interface/Category/ICategoryRepository";
import { IadminService } from "../Interface/Admin/IadminService";
import { ICategory } from "../Model/categorySchema";
import { IMenteeRepository } from "../Interface/Mentee/iMenteeRepository";
import { IMentee } from "../Model/menteeModel";
import { IMentor } from "../Model/mentorModel";
import { IMentorRepository } from "../Interface/Mentor/IMentorRepository";
export declare class adminService implements IadminService {
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
//# sourceMappingURL=adminService.d.ts.map