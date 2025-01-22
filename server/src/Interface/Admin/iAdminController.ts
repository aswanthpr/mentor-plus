import {Request,Response} from 'express'


export interface IadminController{
    adminRefreshToken(req: Request, res: Response): Promise<void>  

    createCategory(req:Request,res:Response):Promise<void>
    categoryData(req:Request,res:Response):Promise<void>;
    editCategory(req:Request,res:Response):Promise<void>;
    changeCategoryStatus(req:Request,res:Response):Promise<void>;

    //mentee mgt
    menteeData(req:Request,res:Response):Promise<void>
    changeMenteeStatus(req:Request,res:Response):Promise<void>;
    editMentee(req:Request,res:Response):Promise<void>;
    addMentee(req:Request,res:Response):Promise<void>;

    //mentor
    mentorData(req:Request,res:Response):Promise<void>;
    mentorVerify(req: Request, res: Response):Promise<void>;
    changeMentorStatus(req: Request, res: Response):Promise<void>;
   
}