import { IMentee } from "../../MODEL/MenteeModel";


export interface IAuthRepository{
    findByEmail(email:string):Promise<IMentee | null>
    createMentee(userData:IMentee):Promise<IMentee>

    DBMainLogin(email:string):Promise<IMentee|null>
}