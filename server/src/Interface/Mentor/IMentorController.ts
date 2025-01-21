import { Request,Response } from "express"

export interface IMentorController{
   
    getMentorProfile(req:Request,res:Response):Promise<void>;
    getMentorLogout(req: Request, res: Response): Promise<void>;
    getMentorRefreshToken(req:Request,res:Response):Promise<void>;
    getMentorEditProfile(req: Request, res: Response): Promise<void>;
    getProfilePasswordChange(req:Request,res:Response):Promise<void>;
    getMentorProfileImageChange(req: Request, res: Response): Promise<void>;
    getHomeData(req: Request, res: Response): Promise<void>;
    
}