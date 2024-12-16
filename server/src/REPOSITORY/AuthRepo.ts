import { IAuthRepository } from "../INTERFACE/Auth/IAuthRepository";
import menteeSchema, { IMentee } from "../MODEL/MenteeModel";
import { IOtp } from "../MODEL/otpModel";
import { BaseRepository } from "./BaseRepo";


 class AuthRepository extends BaseRepository<IMentee> implements IAuthRepository {
   
    constructor(){
        super(menteeSchema);
    }


    async findByEmail(email: string):Promise<IMentee|null> {
        try {
            console.log('this is auth repoo')
            return await this.findOne({email})//find one in base repo
        } catch (error:any) {
           console.log('Error while finding user with email',email,error) ;
           throw new Error('Error while finding user by Email')
        } 
    }
    async create_Mentee(userData:IMentee):Promise<IMentee>{
        try {
            return await this.createMentee(userData);
        } catch (error:any) {
            console.log(`error while doing signup ${error}`);  
            throw new Error("error while mentee Signup");
        }
    }
  
}
export default new AuthRepository()