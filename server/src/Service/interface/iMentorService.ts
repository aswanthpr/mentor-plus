import { Iquestion } from "../../Model/questionModal";
import { Icategory } from "../../Model/categoryModel";
import { Imentor } from "../../Model/mentorModel"
import { Itime } from "../../Model/timeModel";
import { ObjectId } from "mongoose";
import { ImentorChartData } from "src/Types";
import { MentorDTO } from "../../dto/mentor/mentorDTO";

export interface ImentorService {

    mentorProfile(token: string): Promise<{ success: boolean, message: string, result: MentorDTO | null, status: number, categories: Icategory[] | [] }>;
    mentorRefreshToken(refresh: string): Promise<{ success: boolean, message: string, status: number, accessToken?: string, refreshToken?: string }>
    passwordChange(currentPassword: string, newPassword: string, id: string): Promise<{ success: boolean, message: string, status: number }>;
    mentorProfileImageChange(image: Express.Multer.File | null, id: string): Promise<{ success: boolean; message: string; status: number; profileUrl?: string }>;
    mentorEditProfile(mentorData: Imentor, resume: Express.Multer.File | null): Promise<{ success: boolean, message: string, status: number, result: Imentor | null }>
    questionData(filter: string,search:string,sortField:string,sortOrder:string,page:number,limit:number): Promise<{ success: boolean; message: string; status: number; homeData: Iquestion[] |[],totalPage:number }>
    createTimeSlots(type:string,schedule:unknown,mentorId:ObjectId):Promise<{success: boolean; message: string; status: number; timeSlots:Itime[]|[] }>;
   getTimeSlots(mentorId:ObjectId,limit:number,page:number,search:string,filter:string,sortField:string,sortOrder:string):Promise<{success: boolean; message: string; status: number; timeSlots:Itime[]|[],totalPage:number}> ;
   removeTimeSlot(slotId:string):Promise<{success: boolean; message: string; status: number;}>;
   mentorChartData(mentorId:ObjectId,timeRange:string):Promise<{success: boolean; message: string; status: number,result:ImentorChartData|null}>
}