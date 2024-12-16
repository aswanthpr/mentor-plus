import { IMentee } from "../../MODEL/MenteeModel";
import { IOtp } from "../../MODEL/otpModel";

export interface IAuthRepository{
    findByEmail(email:string):Promise<IMentee | null>
    createMentee(userData:IMentee):Promise<IMentee>
    
}