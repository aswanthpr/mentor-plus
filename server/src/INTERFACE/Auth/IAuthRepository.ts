import { IMentee } from "../../MODEL/MenteeModel";


export interface IAuthRepository{
    findByEmail(email:string):Promise<IMentee | null>
    createMentee(userData:IMentee):Promise<IMentee>
    DBMainLogin(email:string):Promise<IMentee|null>
    DBforgot_PasswordChange(email:string,hashedPassword:string):Promise<IMentee|null|undefined>

    DBfindBy_id(userId:string):Promise<IMentee|null|undefined>
}