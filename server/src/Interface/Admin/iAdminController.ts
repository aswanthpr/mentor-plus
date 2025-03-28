import {NextFunction, Request,Response} from 'express'


export interface IadminController{
    
    adminRefreshToken(req: Request, res: Response,next: NextFunction): Promise<void>  

    createCategory(req:Request,res:Response,next: NextFunction):Promise<void>
    categoryData(req:Request,res:Response,next: NextFunction):Promise<void>;
    editCategory(req:Request,res:Response,next: NextFunction):Promise<void>;
    changeCategoryStatus(req:Request,res:Response,next: NextFunction):Promise<void>;
    getDashboardData(req:Request,res:Response,next: NextFunction):Promise<void>;

    //mentee mgt
    menteeData(req:Request,res:Response,next: NextFunction):Promise<void>;
    changeMenteeStatus(req:Request,res:Response,next: NextFunction):Promise<void>;
    editMentee(req:Request,res:Response,next: NextFunction):Promise<void>;
    addMentee(req:Request,res:Response,next: NextFunction):Promise<void>;

    //mentor
    mentorData(req:Request,res:Response,next: NextFunction):Promise<void>;
    mentorVerify(req: Request, res: Response,next: NextFunction):Promise<void>;
    changeMentorStatus(req: Request, res: Response,next: NextFunction):Promise<void>;

    
}