import { Request,Response } from "express"

export interface IMentorController{
   
    getMentorLogout(req: Request, res: Response): Promise<void>;
    getMentorProfile(req:Request,res:Response):Promise<void>
    getMentorRefreshToken(req:Request,res:Response):Promise<void>
}