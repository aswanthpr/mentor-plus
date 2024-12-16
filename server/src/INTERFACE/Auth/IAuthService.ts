import {IMentee} from "../../MODEL/MenteeModel";

export default interface IAuthService{
    mentee_Signup(userData:IMentee):Promise<IMentee>;
} 