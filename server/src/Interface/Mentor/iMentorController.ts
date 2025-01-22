import { Request,Response } from "express"

export interface ImentorController{
   
    mentorProfile(req:Request,res:Response):Promise<void>;
    mentorLogout(req: Request, res: Response): Promise<void>;
    mentorRefreshToken(req:Request,res:Response):Promise<void>;
    mentorEditProfile(req: Request, res: Response): Promise<void>;
    profilePasswordChange(req:Request,res:Response):Promise<void>;
    mentorProfileImageChange(req: Request, res: Response): Promise<void>;
    homeData(req: Request, res: Response): Promise<void>;
    
}