import {Request,Response} from 'express'


export interface IAdminController{
    getCreateCategory(req:Request,res:Response):Promise<void>
    getCategoryData(req:Request,res:Response):Promise<void>;
    getEditCategory(req:Request,res:Response):Promise<void>;
    getChangeCategoryStatus(req:Request,res:Response):Promise<void>;

    //mentee mgt
    getMenteeData(req:Request,res:Response):Promise<void>
    getChangeMenteeStatus(req:Request,res:Response):Promise<void>;
    getEditMentee(req:Request,res:Response):Promise<void>;
    getAddMentee(req:Request,res:Response):Promise<void>
}