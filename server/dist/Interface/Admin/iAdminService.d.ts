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
    categoryData(searchQuery: string, statusFilter: string, sortField: string, sortOrder: string, page: number, limit: number): Promise<{
        success: boolean;
        message: string;
        categories?: Icategory[];
        status: number;
        totalPage: number;
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
    menteeData(search: string, sortField: string, sortOrder: string, statusFilter: string, page: number, limit: number): Promise<{
        success: boolean;
        message: string;
        status: number;
        Data?: Imentee[] | [];
        totalPage: number;
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
    mentorData(searchQuery: string, activeTab: string, sortField: string, sortOrder: string, page: number, limit: number): Promise<{
        success: boolean;
        message: string;
        status: number;
        mentorData: Imentor[] | [];
        totalPage: number;
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