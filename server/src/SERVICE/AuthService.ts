import bcrypt from 'bcrypt';
import genOtp from '../UTILS/otpGen.util';
import { nodeMailer } from '../UTILS/nodemailer.util';
import { IAuthRepository } from "../INTERFACE/Auth/IAuthRepository";
import IAuthService from "../INTERFACE/Auth/IAuthService";
import { IMentee } from "../MODEL/MenteeModel";



export class AuthService implements IAuthService{

constructor(private _AuthRepository:IAuthRepository){}
    async mentee_Signup(userData:IMentee){
        try {
            console.log('this is service')
            const existingUser  = await this._AuthRepository.findByEmail(userData.email);
            if(existingUser){
                throw new Error('user with this email is already exists');
            }
            const salt:string  = await bcrypt.genSalt(10) 
            console.log(salt,'\x1b[32m%s\x1b[0m ths is salt')
            const hashPassword:string  = await bcrypt.hash(userData.password,salt);
             userData.password = hashPassword

            const newMentee =await this._AuthRepository.createMentee(userData);
            console.log(newMentee,'thsi is from service');

            const otp:string = genOtp()
            const saveOtp = await this._AuthRepository
            console.log(otp,'thsi is the new otp')
            await nodeMailer(userData.email,Number(otp))

            
            return newMentee;
         } catch (error:unknown) { 
            if(error instanceof Error){
                console.error('\x1b[35m%s\x1b[0m','error while create mentee');
                throw new Error(`Failed to create  Mentee ${error.message}`)
            }else{
                console.log('An unknown error occured',error);
                throw error
            }
        }
    }
    async verifyOtp(otp:){

    }
}