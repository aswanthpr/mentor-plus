import { ICategory } from "../../MODEL/categorySchema";
import { IMentee } from "../../MODEL/MenteeModel";
import { IMentor } from "../../MODEL/mentorModel";
export interface IMenteeService {
    BLRefreshToken(refresh: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        accessToken?: string;
        refreshToken?: string;
    }>;
    blMenteeProfile(refreshToken: string): Promise<{
        success: boolean;
        message: string;
        result: IMentee | null;
        status: number;
    }>;
    blEditMenteeProfile(formData: Partial<IMentee>): Promise<{
        success: boolean;
        message: string;
        result: IMentee | null;
        status: number;
    }>;
    blPasswordChange(currentPassword: string, newPassword: string, _id: string): Promise<{
        success: boolean;
        message: string;
        status: number;
    }>;
    blProfileChange(image: Express.Multer.File | null, id: string): Promise<{
        success: boolean;
        message: string;
        status: number;
    }>;
    blExploreData(): Promise<{
        success: boolean;
        message: string;
        status: number;
        mentor?: IMentor[] | null;
        category?: ICategory[] | null;
    }>;
}
//# sourceMappingURL=IMenteeService.d.ts.map