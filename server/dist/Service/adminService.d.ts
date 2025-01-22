import { Imentor } from "../Model/mentorModel";
import { Imentee } from "../Model/menteeModel";
import { Icategory } from "../Model/categorySchema";
import { IadminService } from "../Interface/Admin/iAdminService";
import { IcategoryRepository } from "../Interface/Category/iCategoryRepository";
import { ImenteeRepository } from "../Interface/Mentee/iMenteeRepository";
import { ImentorRepository } from "../Interface/Mentor/iMentorRepository";
export declare class adminService implements IadminService {
    private _categoryRepository;
    private _menteeRepository;
    private _mentorRepository;
    constructor(_categoryRepository: IcategoryRepository, _menteeRepository: ImenteeRepository, _mentorRepository: ImentorRepository);
    adminRefreshToken(refresh: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        accessToken?: string;
        refreshToken?: string;
    }>;
    createCategory(Data: {
        category: string;
    }): Promise<{
        success: boolean;
        message: string;
        result?: Icategory;
        status: number;
    }>;
    categoryData(): Promise<{
        success: boolean;
        message: string;
        categories?: Icategory[];
    }>;
    editCategory(id: string, category: string): Promise<{
        success: boolean;
        message: string;
    }>;
    changeCategoryStatus(id: string): Promise<{
        success: boolean;
        message: string;
        status: number;
    }>;
    menteeData(): Promise<{
        success: boolean;
        message: string;
        status: number;
        Data?: Imentee[];
    }>;
    changeMenteeStatus(id: string): Promise<{
        success: boolean;
        message: string;
        status: number;
    }>;
    editMentee(formData: Partial<Imentee>): Promise<{
        success: boolean;
        message: string;
        status?: number;
    }>;
    addMentee(formData: Partial<Imentee>): Promise<{
        success: boolean;
        message: string;
        status?: number;
        mentee?: Imentee | null;
    }>;
    mentorData(): Promise<{
        success: boolean;
        message: string;
        status: number;
        mentorData: Imentor[] | [];
    }>;
    mentorVerify(id: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        result: Imentor | null;
    }>;
    mentorStatusChange(id: string): Promise<{
        success: boolean;
        message: string;
        status: number;
    }>;
}
//# sourceMappingURL=adminService.d.ts.map