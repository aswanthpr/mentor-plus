import { Request,Response } from "express";
import { IMentorController } from "../INTERFACE/Mentor/IMentorController";
import { IMentorService } from "../INTERFACE/Mentor/IMentorService";

export class MentorController implements IMentorController{ 
    constructor(private _mentorService:IMentorService){}

    
async getMentorLogout(req: Request, res: Response): Promise<void> { 
    try { 
      console.log(req.path.split('/'))
      res.clearCookie('mentorToken');
      res.status(200).json({ success: true, message: "Logged out successfully" });
     
    } catch (error:unknown) {
      res.status(500).json({ success: false, message: "Internal server error" });
      throw new Error(
        `Error while mentee  logout ${error instanceof Error ? error.message : String(error) 
        }` 
      );
    }
  } 

  async getMentorProfile(req:Request,res:Response):Promise<void>{
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        console.log(token,'sjfojasdoidfjao5555555555555555')

          const result = await this._mentorService.blMentorProfile(token as string);

          res.status(result?.status).json({success:result?.success,message:result?.message,result:result?.result});
    } catch (error:unknown) {
        throw new Error(
            `Error while mentee  logout ${error instanceof Error ? error.message : String(error) 
            }` 
          );
    }
  }


  //for creating new access token
  async getMentorRefreshToken(req: Request, res: Response): Promise<void> {
    try {

   
      const result = await this._mentorService.BLMentorRefreshToken(req.cookies?.refreshToken);

      if (result?.success) {
        res.cookie("mentorToken", result?.refreshToken as string, {
          signed: true,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',//in development fasle
          sameSite: "strict",
          maxAge: 14 * 24 * 60 * 60 * 1000,
        });

        
      } 
      res.status(result.status).json({success:result?.success,message:result?.message,accessToken:result?.accessToken});

    } catch (error: unknown) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });

      throw new Error(
        `error while geting refreshToken${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

}