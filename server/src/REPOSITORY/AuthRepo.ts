import { IAuthRepository } from "../INTERFACE/Auth/IAuthRepository";
import menteeSchema, { IMentee } from "../MODEL/MenteeModel";
import { BaseRepository } from "./BaseRepo";


 class AuthRepository extends BaseRepository<IMentee> implements IAuthRepository { 
   
    constructor(){
        super(menteeSchema);
    }


    async findByEmail(email: string):Promise<IMentee|null> {
        try {
          
            return await this.find_One({email})//find one in base repo
        } catch (error:any) {
           console.log('Error while finding user with email',email,error) ;
           throw new Error('Error while finding user by Email')
        } 
    }
    async create_Mentee(userData:IMentee):Promise<IMentee>{
        try {
            return await this.createDocument(userData);
        } catch (error:any) {
            console.log(`error while doing signup ${error}`);  
            throw new Error("error while mentee Signup");
        }
    }
    async DBMainLogin(email: string): Promise<IMentee | null> {
        try {
           
            return await this.find_One({email});
        } catch (error:unknown) {
            throw new Error(`error  in DBMainLogin  while Checking User ${error instanceof Error ? error.message:String(error)}`)
        }
    }


   async DBfindBy_id(userId: string): Promise<IMentee | null|undefined> {
        try {
            return  await this.DBfindBy_id(userId)
        } catch (error:unknown) {
            console.log('error while finding user in DBfindBy_id ',error instanceof Error?error.message:String(error))
        }
    }

    async DBforgot_PasswordChange(email: string, password: string): Promise<IMentee | null|undefined> {
        try {
            return await this.find_One_And_Update(menteeSchema,{email:email},{$set:{password:password}});
        } catch (error:unknown) {
            console.log(`error while find and update on DBforget_passwordChange ${error instanceof Error ? error.message :String(error)}`)
        }
    }

    //admin data fetch
    async DBadminLogin(email:string):Promise<IMentee|null> {
        try {
            return await this.find_One({email})
        } catch (error:unknown) {
            console.log(`error while finding admin ${error instanceof Error ? error.message :String(error)}`)
            return null;
        }
    }
}
export default new AuthRepository() 