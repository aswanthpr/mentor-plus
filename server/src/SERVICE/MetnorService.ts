import { IMentorService } from "../INTERFACE/Mentor/IMentorService";
import { IMentorRepository } from "../INTERFACE/Mentor/IMentorRepository";
import { IMentor } from "../MODEL/mentorModel";
import jwt from "jsonwebtoken";
import { genAccesssToken, genRefreshToken, verifyRefreshToken } from "../UTILS/jwt.utils";

export class MentorService implements IMentorService {
    constructor(private _MentorRepository: IMentorRepository) { };

    async blMentorProfile(token: string): Promise<{ success: boolean, message: string, result: IMentor | null, status: number }> {
        try {

            const decode = jwt.verify(
                token,
                process.env?.JWT_ACCESS_SECRET as string
            ) as { mentorId: string };

            if (!decode) {
                return { success: false, message: "Your session has expired. Please log in again.", status: 403, result: null };
            }

            console.log(decode, decode.mentorId)
            const result = await this._MentorRepository.dbMentorProfile(decode.mentorId);
            if (!result) {
                return { success: false, message: "invalid credential", status: 403, result: null }
            }

            return { success: true, message: "success", result: result, status: 200 }
        } catch (error: unknown) {
            throw new Error(
                `Error while bl metneeProfile in service: ${error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }

async BLMentorRefreshToken(refresh: string): Promise<{
    success: boolean;
    message: string;
    status:number; 
    accessToken?: string;
    refreshToken?: string;
  }> {
    try {
        console.log(refresh,'9999999999999999999999999999999999')
     
           if (!refresh) {
             return { success: false, message: "RefreshToken missing",status:403 };
           }
     
          
          
          const decode= verifyRefreshToken(refresh);
        
          if(!decode){
            return { success: false, message: "Your session has expired. Please log in again.", status: 403 };
   
          }
      console.log(decode,'thsi is verifyRefreshToken')
           let { mentorId } = decode;
   
     
           const accessToken: string|undefined = genAccesssToken (mentorId as string)
           
   
           const refreshToken:string|undefined =genRefreshToken(mentorId as string)
           
           return {
             success: true,
             message: "Token refresh successfully",
             accessToken,
             refreshToken,
             status:200
           };
    } catch (error: unknown) {
      console.error("Error while generating BLRefreshToken", error);
      return { success: false, message: "Invalid or expired refresh token" ,status:500};
    }
  }

}