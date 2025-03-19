import { Imentor } from "../Model/mentorModel";
import { Imentee } from "../Model/menteeModel";
import { Icategory } from "../Model/categorySchema";
import { IadminService } from "../Interface/Admin/iAdminService";
import { IcategoryRepository } from "../Interface/Category/iCategoryRepository";
import { ImenteeRepository } from "../Interface/Mentee/iMenteeRepository";
import { ImentorRepository } from "../Interface/Mentor/iMentorRepository";
import { InotificationRepository } from "../Interface/Notification/InotificationRepository";
import { IslotScheduleRepository } from "../Interface/Booking/iSlotScheduleRepository";
import { IcardData } from "../Types";
export declare class adminService implements IadminService {
    private readonly _categoryRepository;
    private readonly _menteeRepository;
    private readonly _mentorRepository;
    private readonly _notificationRepository;
    private readonly _slotScheduleRepository;
    constructor(_categoryRepository: IcategoryRepository, _menteeRepository: ImenteeRepository, _mentorRepository: ImentorRepository, _notificationRepository: InotificationRepository, _slotScheduleRepository: IslotScheduleRepository);
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
    mentorData(search: string, activeTab: string, sortField: string, sortOrder: string, page: number, limit: number): Promise<{
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
//# sourceMappingURL=adminService.d.ts.map