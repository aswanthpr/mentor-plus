import { ImenteeService } from "../Interface/Mentee/iMenteeService";
import { Imentee } from "../Model/menteeModel";
import { ImenteeRepository } from "../Interface/Mentee/iMenteeRepository";
import { Imentor } from "../Model/mentorModel";
import { ImentorRepository } from "../Interface/Mentor/iMentorRepository";
import { IcategoryRepository } from "../Interface/Category/iCategoryRepository";
import { Icategory } from "../Model/categorySchema";
import { Iquestion } from "src/Model/questionModal";
import { IquestionRepository } from "src/Interface/Qa/IquestionRepository";
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
    exploreData(): Promise<{
        success: boolean;
        message: string;
        status: number;
        mentor?: Imentor[] | null;
        category?: Icategory[] | null;
        skills: Imentor[] | undefined;
    }>;
    homeData(filter: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        homeData: Iquestion[] | null;
    }>;
}
//# sourceMappingURL=menteeService.d.ts.map