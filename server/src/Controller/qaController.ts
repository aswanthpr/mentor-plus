import { Request, Response } from "express";
import  mongoose, { ObjectId } from "mongoose";
import { IqaController } from "../Interface/Qa/IqaController";
import { IqaService } from "../Interface/Qa/IqaService";


class qaController implements IqaController {
  constructor(private _qaService: IqaService) {}

  async addQuestion(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user as Express.User;

      const { message, success, status, question } =
        await this._qaService.addQuestionService(req.body, userId as ObjectId);
      res.status(status).json({ success, message, question });
    } catch (error: unknown) {
      console.log(error instanceof Error ? error.message : String(error));
    }
  }
  async questionData(req: Request, res: Response): Promise<void> {
    try {
      const { filter } = req.params;
      const { success, message, question, status, userId } =
        await this._qaService.questionData(req.user as ObjectId, filter);

      res.status(status).json({ message, success, status, question, userId });
    } catch (error: unknown) {
      console.log(error instanceof Error ? error.message : String(error));
    }
  }
  async editQuestion(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.body, "this si body", req.user);
      const { questionId, updatedQuestion } = req.body;
      const { status, message, success, question } =
        await this._qaService.editQuestion(questionId, updatedQuestion);
      console.log(message, success, question, "this si response");

      res.status(status).json({ success, message, question });
    } catch (error: unknown) {
      console.log(
        "error while editing question",
        error instanceof Error ? error.message : String(error)
      );
    }
  }
  async createNewAnswer(req: Request, res: Response): Promise<void> {
    try {
      const { answer, questionId, userType } = req.body;
      console.log(questionId,'this is fromn controlller 👾☘️🌿🌱🍂🍁🥳')
if(!questionId){
  console.log('👾🍀☘️🌿🌱🍂🍁🥳')
  return 

}
const questId = new  mongoose.Types.ObjectId(questionId as string) as unknown as  mongoose.Schema.Types.ObjectId;

      console.log(questId,'thsi is the questino id after type convertion')
      const { status, success, message, answers } =
        await this._qaService.createNewAnswer(
          answer,
          questId,
          req.user as ObjectId,
          userType
        );
      res.status(status).json({ success, message, answers });
    } catch (error: unknown) {
      throw new Error(
        `error while creating new Answer ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
export default qaController;
