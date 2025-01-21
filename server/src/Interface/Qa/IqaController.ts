import { Request,Response } from "express";
export interface IqaController{
    addQuestion(req:Request,res: Response):Promise<void>;
    getQuestionData(req:Request,res: Response):Promise<void>;
    editQuestion(req: Request, res: Response): Promise<void> ;
    createNewAnswer(req: Request, res: Response): Promise<void> ;
}