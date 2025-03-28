import { NextFunction, Request,Response } from "express"

export interface ImentorController{
   
    mentorProfile(req:Request,res:Response,next: NextFunction):Promise<void>;
    mentorLogout(req: Request, res: Response,next: NextFunction): Promise<void>;
    mentorRefreshToken(req:Request,res:Response,next: NextFunction):Promise<void>;
    mentorEditProfile(req: Request, res: Response,next: NextFunction): Promise<void>;
    profilePasswordChange(req:Request,res:Response,next: NextFunction):Promise<void>;
    mentorProfileImageChange(req: Request, res: Response,next: NextFunction): Promise<void>;
    questionData(req: Request, res: Response,next: NextFunction): Promise<void>;
    createTimeSlots(req: Request, res: Response,next: NextFunction): Promise<void>;
    getTimeSlots(req: Request, res: Response,next: NextFunction): Promise<void>;
    removeTimeSlot(req: Request, res: Response,next: NextFunction): Promise<void>;
    chartData(req: Request, res: Response,next: NextFunction): Promise<void>;
}