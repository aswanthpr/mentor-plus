import { Iquestion } from "../../Model/questionModal";
import { Icategory } from "../../Model/categorySchema";
import { Imentor } from "../../Model/mentorModel";
import { Itime } from "../../Model/timeModel";
import { ObjectId } from "mongoose";
export interface ImentorService {
    mentorProfile(token: string): Promise<{
        success: boolean;
        message: string;
        result: Imentor | null;
        status: number;
        categories: Icategory[] | [];
    }>;
    mentorRefreshToken(refresh: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        accessToken?: string;
        refreshToken?: string;
    }>;
    passwordChange(currentPassword: string, newPassword: string, id: string): Promise<{
        success: boolean;
        message: string;
        status: number;
    }>;
    mentorProfileImageChange(image: Express.Multer.File | null, id: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        profileUrl?: string;
    }>;
    mentorEditProfile(mentorData: Imentor, resume: Express.Multer.File | null): Promise<{
        success: boolean;
        message: string;
        status: number;
        result: Imentor | null;
    }>;
    homeData(filter: string, search: string, page: number, limit: number): Promise<{
        success: boolean;
        message: string;
        status: number;
        homeData: Iquestion[] | [];
        totalPage: number;
    }>;
    createTimeSlots(type: string, schedule: unknown, mentorId: ObjectId): Promise<{
        success: boolean;
        message: string;
        status: number;
        timeSlots: Itime[] | [];
    }>;
    getTimeSlots(mentorId: ObjectId): Promise<{
        success: boolean;
        message: string;
        status: number;
        timeSlots: Itime[] | [];
    }>;
    removeTimeSlot(slotId: string): Promise<{
        success: boolean;
        message: string;
        status: number;
    }>;
}
//# sourceMappingURL=iMentorService.d.ts.map