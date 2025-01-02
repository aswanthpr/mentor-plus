import { ICategory } from "../../MODEL/categorySchema";
import { IMentor } from "../../MODEL/mentorModel"


export interface IMentorService {
 
    blMentorProfile(token: string): Promise<{ success: boolean, message: string, result: IMentor | null, status: number,categories:ICategory[]|[] }>;
    blMentorRefreshToken(refresh:string):Promise<{success:boolean,message:string,status:number,accessToken?:string,refreshToken?:string}>
    blPasswordChange(currentPassword:string,newPassword:string,id:string):Promise<{success:boolean,message:string,status:number}>;
    blMentorProfileImageChange(image: Express.Multer.File | null, id: string): Promise<{ success: boolean; message: string; status: number; profileUrl?: string }>;
    // blMentorEditProfile(mentorData:IMentor):Promise<IMentor|null>
}