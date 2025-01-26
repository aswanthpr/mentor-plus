import { Request, Response } from "express";
export interface IqaController {
    addQuestion(req: Request, res: Response): Promise<void>;
    questionData(req: Request, res: Response): Promise<void>;
    editQuestion(req: Request, res: Response): Promise<void>;
    createNewAnswer(req: Request, res: Response): Promise<void>;
    editAnswer(req: Request, res: Response): Promise<void>;
    deleteQuestion(req: Request, res: Response): Promise<void>;
    allQaData(req: Request, res: Response): Promise<void>;
    blockQuestion(req: Request, res: Response): Promise<void>;
    blockAnswer(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=IqaController.d.ts.map