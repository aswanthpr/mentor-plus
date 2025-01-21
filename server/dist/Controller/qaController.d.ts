import { Request, Response } from "express";
import { IqaController } from "../Interface/Qa/IqaController";
import { IqaService } from "../Interface/Qa/IqaService";
declare class qaController implements IqaController {
    private _qaService;
    constructor(_qaService: IqaService);
    addQuestion(req: Request, res: Response): Promise<void>;
    getQuestionData(req: Request, res: Response): Promise<void>;
    editQuestion(req: Request, res: Response): Promise<void>;
    createNewAnswer(req: Request, res: Response): Promise<void>;
}
export default qaController;
//# sourceMappingURL=qaController.d.ts.map