import { Iquestion } from "../../Model/questionModal";
import { Icategory } from "../../Model/categorySchema";
import { Imentee } from "../../Model/menteeModel";
import { Imentor } from "../../Model/mentorModel";
import { Itime } from "src/Model/timeModel";
export interface ImenteeService {
    homeData(filter: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        homeData: Iquestion[] | null;
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
    exploreData(): Promise<{
        success: boolean;
        message: string;
        status: number;
        mentor?: Imentor[] | null;
        category?: Icategory[] | null;
        skills: Imentor[] | undefined;
    }>;
    getMentorDetailes(category: string, mentorId: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        mentor: Imentor[] | [];
    }>;
    getTimeSlots(mentorId: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        timeSlots: Itime[] | [];
    }>;
}
//# sourceMappingURL=iMenteeService.d.ts.map