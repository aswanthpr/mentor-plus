import { Imentee } from "../../Model/menteeModel";
import { Imentor } from "../../Model/mentorModel";
import { Iquestion } from "../../Model/questionModal";
import { Icategory } from "../../Model/categorySchema";
import { ImenteeService } from "../interface/iMenteeService";
import { IcategoryRepository } from "../../Repository/interface/iCategoryRepository";
import { ImentorRepository } from "../../Repository/interface/iMentorRepository";
import { IquestionRepository } from "../../Repository/interface/IquestionRepository";
import { ImenteeRepository } from "../../Repository/interface/iMenteeRepository";
import { MentorDTO } from "../../dto/mentor/mentorDTO";
export declare class menteeService implements ImenteeService {
    private _menteeRepository;
    private _mentorRepository;
    private _categoryRepository;
    private _questionRepository;
    constructor(_menteeRepository: ImenteeRepository, _mentorRepository: ImentorRepository, _categoryRepository: IcategoryRepository, _questionRepository: IquestionRepository);
    menteeProfile(refreshToken: string): Promise<{
        success: boolean;
        message: string;
        result: Imentee | null;
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
    profileChange(image: Express.Multer.File | null, id: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        profileUrl?: string;
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
        currentPage?: number;
        totalPage?: number;
    }>;
    homeData(filter: string, search: string, sortField: string, sortOrder: string, page: number, limit: number): Promise<{
        success: boolean;
        message: string;
        status: number;
        homeData: Iquestion[] | [];
        totalPage: number;
    }>;
    getMentorDetailes(category: string, mentorId: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        mentor: Imentor[] | [];
    }>;
}
//# sourceMappingURL=menteeService.d.ts.map