import { ICategory } from "../../Model/categorySchema";
import { IMentee } from "../../Model/menteeModel";
import { IMentor } from "../../Model/mentorModel";
export interface IadminService {
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
//# sourceMappingURL=IadminService.d.ts.map