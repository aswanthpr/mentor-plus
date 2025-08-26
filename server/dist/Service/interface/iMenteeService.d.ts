import { Iquestion } from "../../Model/questionModal";
import { Icategory } from "../../Model/categorySchema";
import { Imentee } from "../../Model/menteeModel";
import { Imentor } from "../../Model/mentorModel";
import { MentorDTO } from "../../dto/mentor/mentorDTO";
export interface ImenteeService {
    homeData(filter: string, search: string, sortField: string, sortOrder: string, page: number, limit: number): Promise<{
        success: boolean;
        message: string;
        status: number;
        homeData: Iquestion[] | [];
        totalPage: number;
    }>;
    menteeProfile(refreshToken: string): Promise<{
        success: boolean;
        message: string;
        result: Imentee | null;
        status: number;
    }>;
    profileChange(image: Express.Multer.File | null, id: string): Promise<{
        success: boolean;
        message: string;
        status: number;
    }>;
    editMenteeProfile(formData: Partial<Imentee>): Promise<{
        success: boolean;
        message: string;
        result: Imentee | null;
        status: number;
    }>;
    passwordChange(currentPassword: string, newPassword: string, _id: string): Promise<{
        success: boolean;
        message: string;
        status: number;
    }>;
    refreshToken(refresh: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        accessToken?: string;
        refreshToken?: string;
    }>;
    exploreData(params: {
        search: string | undefined;
        categories: string[] | [];
        skill: string[] | [];
        page: string;
        limit: string;
        sort: string;
    }): Promise<{
        success: boolean;
        message: string;
        status: number;
        mentor?: MentorDTO[] | null;
        category?: Icategory[] | null;
        skills: Imentor[] | undefined;
        totalPage?: number;
        currentPage?: number;
    }>;
    getMentorDetailes(category: string, mentorId: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        mentor: Imentor[] | [];
    }>;
}
//# sourceMappingURL=iMenteeService.d.ts.map