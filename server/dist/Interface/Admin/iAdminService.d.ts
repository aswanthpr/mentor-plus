import { IcardData } from "src/Types";
import { Icategory } from "../../Model/categorySchema";
import { Imentee } from "../../Model/menteeModel";
import { Imentor } from "../../Model/mentorModel";
export interface IadminService {
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
    dashboardData(timeRange: string): Promise<{
        message: string;
        success: boolean;
        status: number;
        salesData: IcardData | null;
    }>;
}
//# sourceMappingURL=iAdminService.d.ts.map