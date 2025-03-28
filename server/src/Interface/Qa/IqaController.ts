import { NextFunction, Request,Response } from "express";

export interface IqaController{
    addQuestion(req:Request,res: Response,next: NextFunction):Promise<void>;
    questionData(req:Request,res: Response,next: NextFunction):Promise<void>;
    editQuestion(req: Request, res: Response,next: NextFunction): Promise<void> ;
    createNewAnswer(req: Request, res: Response,next: NextFunction): Promise<void> ;
    editAnswer(req:Request,res:Response,next: NextFunction):Promise<void>;
    deleteQuestion(req: Request, res: Response,next: NextFunction): Promise<void>;
    allQaData(req: Request, res: Response,next: NextFunction): Promise<void>;
    blockQuestion(req: Request, res: Response,next: NextFunction): Promise<void>;
    blockAnswer(req: Request, res: Response,next: NextFunction): Promise<void>;
}