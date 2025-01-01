import { IMentor } from "../../MODEL/mentorModel"


export interface IMentorService {
 
    blMentorProfile(token: string): Promise<{ success: boolean, message: string, result: IMentor | null, status: number }>;
    BLMentorRefreshToken(refresh:string):Promise<{success:boolean,message:string,status:number,accessToken?:string,refreshToken?:string}>
}