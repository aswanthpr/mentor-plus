import { Request, Response } from "express";
import { IAuthController } from "../INTERFACE/Auth/IAuthController";
import IAuthService from "../INTERFACE/Auth/IAuthService";

export class AuthController implements IAuthController {
  constructor(private _AuthService: IAuthService) {}

  async menteeSignup(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.body,"signup req body");
      await this._AuthService.mentee_Signup(req.body);
      await this._AuthService.
      res.json({success:true,message:'otp successfully send to mail'});

    } catch (error:unknown) {
    
       console.error('error during mentee registration');
       throw new Error(`error while mentee Signup ${error instanceof Error?error.message:error}`)
 
    }
  }
}
