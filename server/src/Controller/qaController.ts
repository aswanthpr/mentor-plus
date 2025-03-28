import { NextFunction, Request, Response } from "express";
import mongoose, { ObjectId } from "mongoose";
import { IqaController } from "../Interface/Qa/IqaController";
import { IqaService } from "../Interface/Qa/IqaService";

class qaController implements IqaController {
  constructor(private _qaService: IqaService) {}

  async addQuestion(req: Request, res: Response,next: NextFunction): Promise<void> {
    try {
      const userId = req.user as Express.User;

      const { message, success, status, question } =
        await this._qaService.addQuestionService(req.body, userId as ObjectId);
      res.status(status).json({ success, message, question });
    } catch (error: unknown) {
      next(error)
    }
  }
  async questionData(req: Request, res: Response,next: NextFunction): Promise<void> {
    try {
      const { filter,search,limit,page,sortField,sortOrder } = req.query;
      console.log(filter,search, limit ,page, sortField,sortOrder,'sdfsdf')
      const { success, message, question, status, userId } =
        await this._qaService.questionData(req.user as ObjectId,
          String( filter),
          String( search),
          String(sortField),
          String(sortOrder),
          Number(limit),
          Number(page),


      );

      res.status(status).json({ message, success, status, question, userId });
    } catch (error: unknown) {
      next(error)
    }
  }
  //edit question from mentee home && qa
  async editQuestion(req: Request, res: Response,next: NextFunction): Promise<void> {
    try {
      const { questionId, updatedQuestion, filter } = req.body;
      const { status, message, success, question } =
        await this._qaService.editQuestion(questionId, updatedQuestion, filter);


      res.status(status).json({ success, message, question: question![0] });
    } catch (error: unknown) {
      next(error)
    }
  }
  async createNewAnswer(req: Request, res: Response,next: NextFunction): Promise<void> {
    try {
      const { answer, questionId, userType } = req.body;

      const questId = new mongoose.Types.ObjectId(
        questionId as string
      ) as unknown as mongoose.Schema.Types.ObjectId;

      const { status, success, message, answers } =
        await this._qaService.createNewAnswer(
          answer,
          questId,
          req.user as ObjectId,
          userType
        );
      res.status(status).json({ success, message, answers });
    } catch (error: unknown) {
      next(error)
    }
  }
  //edit answer in mentee
  async editAnswer(req: Request, res: Response,next: NextFunction): Promise<void> {
    try {
      const { answerId, content } = req.body;

      const { status, message, success, answer } =
        await this._qaService.editAnswer(content, answerId);

      res.status(status).json({ success, message, answer });
    } catch (error: unknown) {
      next(error)
    }
  }
  async deleteQuestion(req: Request, res: Response,next: NextFunction): Promise<void> {
    try {
      const { questionId } = req.params;

      const { status, success, message } = await this._qaService.deleteQuestion(
        questionId
      );

      res.status(status).json({ success, message });
    } catch (error: unknown) {
      next(error)
    }
  }
  async allQaData(req: Request, res: Response,next: NextFunction): Promise<void> {
    try {
      const {
        search = "",
        Status = "all",
        sortField = "createdAt",
        sortOrder = "desc",
        page = 1,
        limit = 8,
      } = req.query;

      const { message, success, status, questions, totalPage } =
        await this._qaService.allQaData(
          String(search),
          String(Status),
          String(sortField),
          String(sortOrder),
          Number(page),
          Number(limit)
        );

      res
        .status(status)
        .json({ message, status, success, questions, totalPage });
    } catch (error: unknown) {
      next(error)
    }
  }
  //qa status change admin
  // /admin/qa-management/change-question-status
  async blockQuestion(req: Request, res: Response,next: NextFunction): Promise<void> {
    try {
      const result = await this._qaService.changeQuestionStatus(
        req.body?.questionId
      );
      res
        .status(result.status)
        .json({
          success: result?.success,
          message: result?.message,
          result: result?.result,
        });
    } catch (error: unknown) {
      next(error)
    }
  }
  async blockAnswer(req: Request, res: Response,next: NextFunction): Promise<void> {
    try {
      const result = await this._qaService.changeAnswerStatus(
        req.body?.answerId
      );
      console.log(result.result);
      res
        .status(result.status)
        .json({
          success: result?.success,
          message: result?.message,
          result: result?.result,
        });
    } catch (error: unknown) {
      next(error)
    }
  }
}
export default qaController;
