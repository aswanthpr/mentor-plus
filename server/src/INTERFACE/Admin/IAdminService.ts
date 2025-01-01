import { ICategory } from "../../MODEL/categorySchema"
import { IMentee } from "../../MODEL/MenteeModel";
import { IMentor } from "../../MODEL/mentorModel";

export interface IAdminService {
    BLAdminRefreshToken(refresh: string): Promise<{ success: boolean; message: string, status: number; accessToken?: string; refreshToken?: string; }>

    blCreateCategory(Data: { category: string }): Promise<{ success: boolean, message: string, result?: ICategory, status: number }>;
    blCategoryData(): Promise<{ success: boolean, message: string, categories?: ICategory[] }>;
    blEditCategory(id: string, category: string): Promise<{ success: boolean, message: string }>;
    blChangeCategoryStatus(id: string): Promise<{ success: boolean, message: string, status: number }>;

    //metee
    blMenteeData(): Promise<{ success: boolean; message: string; status: number, Data?: IMentee[] }>
    blChangeMenteeStatus(id: string): Promise<{ success: boolean, message: string, status: number }>

    blEditMentee(formData: Partial<IMentee>): Promise<{ success: boolean, message: string, status?: number }>;
    blAddMentee(formData: Partial<IMentee>): Promise<{ success: boolean, message: string, status?: number, mentee?: IMentee | null }>;

    //mentor
    blMentorData(): Promise<{ success: boolean, message: string, status: number, mentorData: IMentor[] | [] }>
    blMentorVerify(id: string): Promise<{ success: boolean, message: string, status: number, result: IMentor | null }>;
    blMentorStatusChange(id: string): Promise<{ success: boolean, message: string, status: number }>;

}