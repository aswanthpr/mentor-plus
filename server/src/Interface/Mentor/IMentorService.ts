import { Iquestion } from "src/Model/questionModal";
import { ICategory } from "../../Model/categorySchema";
import { IMentor } from "../../Model/mentorModel"


export interface IMentorService {
 
    blMentorProfile(token: string): Promise<{ success: boolean, message: string, result: IMentor | null, status: number,categories:ICategory[]|[] }>;
    blMentorRefreshToken(refresh:string):Promise<{success:boolean,message:string,status:number,accessToken?:string,refreshToken?:string}>
    blPasswordChange(currentPassword:string,newPassword:string,id:string):Promise<{success:boolean,message:string,status:number}>;
    blMentorProfileImageChange(image: Express.Multer.File | null, id: string): Promise<{ success: boolean; message: string; status: number; profileUrl?: string }>;
    blMentorEditProfile(mentorData:IMentor,resume:Express.Multer.File|null):Promise<{success:boolean,message:string,status:number,result:IMentor|null}>
    getHomeData(filter:string):Promise<{ success: boolean; message: string; status: number; homeData: Iquestion[] | null; }>
}