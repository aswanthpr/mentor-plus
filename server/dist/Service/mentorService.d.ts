import { ImentorChartData } from "../Types";
import { Itime } from "../Model/timeModel";
import { Imentor } from "../Model/mentorModel";
import { Iquestion } from "../Model/questionModal";
import { Icategory } from "../Model/categorySchema";
import { ImentorService } from "../Interface/Mentor/iMentorService";
import { ImentorRepository } from "../Interface/Mentor/iMentorRepository";
import { IcategoryRepository } from "../Interface/Category/iCategoryRepository";
import { IquestionRepository } from "../Interface/Qa/IquestionRepository";
import { ObjectId } from "mongoose";
import { ItimeSlotRepository } from "../Interface/Booking/iTimeSchedule";
import { IslotScheduleRepository } from "../Interface/Booking/iSlotScheduleRepository";
export declare class mentorService implements ImentorService {
    private _mentorRepository;
    private _categoryRepository;
    private _questionRepository;
    private _timeSlotRepository;
    private readonly _slotScheduleRepository;
    constructor(_mentorRepository: ImentorRepository, _categoryRepository: IcategoryRepository, _questionRepository: IquestionRepository, _timeSlotRepository: ItimeSlotRepository, _slotScheduleRepository: IslotScheduleRepository);
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
    mentorEditProfile(mentorData: Imentor, resume: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        status: number;
        result: Imentor | null;
    }>;
    questionData(filter: string, search: string, sortField: string, sortOrder: string, page: number, limit: number): Promise<{
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
    getTimeSlots(mentorId: ObjectId, limit: number, page: number, search: string, filter: string, sortField: string, sortOrder: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        timeSlots: Itime[] | [];
        totalPage: number;
    }>;
    removeTimeSlot(slotId: string): Promise<{
        success: boolean;
        message: string;
        status: number;
    }>;
    mentorChartData(mentorId: ObjectId, timeRange: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        result: ImentorChartData | null;
    }>;
}
//# sourceMappingURL=mentorService.d.ts.map