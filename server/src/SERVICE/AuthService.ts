import bcrypt from "bcrypt";
import { IAuthRepository } from "../INTERFACE/Auth/IAuthRepository";
import IAuthService from "../INTERFACE/Auth/IAuthService";
import { IMentee } from "../MODEL/MenteeModel";
import pass_hash from '../UTILS/hashPass.util'
import hash_pass from "../UTILS/hashPass.util";

export class AuthService implements IAuthService {
  constructor(private _AuthRepository: IAuthRepository) {}

  async mentee_Signup(
    userData: IMentee
  ): Promise<{ success: boolean; message: string }> {
    try {
        if (!userData.email || !userData.password) {
           return { success: false, message: "Email or password is missing" };
          }
      const existingUser = await this._AuthRepository.findByEmail(
        userData.email
      );
      if (existingUser) {
        return {
          success: false,
          message: "user with this email is already exists",
        };
      }
      // pass hasing 
      const hashPassword = await hash_pass(userData.password);
      userData.password= hashPassword;

      const newMentee = await this._AuthRepository.createMentee(userData);
     
      return { success: true, message: "signup successfull" };

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("\x1b[35m%s\x1b[0m", "error while create mentee");
        throw new Error(`Failed to create  Mentee ${error.message}`);
      } else {
        console.log("An unknown error occured", error);
        throw error;
      }
    }
  }
   async BLMainLogin(userData: IMentee):Promise<{success:boolean, message: string }> {
      try {
          const {email,password} = userData
          console.log(email,password,'logic')
        if(!email || !password){
           return {success:false,message:'login credencial is missing'}
        }
        const result = await this._AuthRepository.DBMainLogin(email);

        console.log(result,'this is the result of checkng logining user');
        if(!result){
            return {success:false,message:'user not exist.Please signup'}
        }
        
        const checkUser = await bcrypt.compare(password,(result?.password as string))

        if(!checkUser){
            return {success:false,message:"password not matching"};
        }
        
        return {success:true,message:'Login Successfull'}
      } catch (error:unknown) {
        throw new Error(`error in Login service ${error instanceof Error ? error.message : String(error)}`);

      }
  }
}
