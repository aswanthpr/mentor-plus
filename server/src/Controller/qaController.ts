import { Request, Response } from "express";
import mongoose, { ObjectId } from "mongoose";
import { IqaController } from "../Interface/Qa/IqaController";
import { IqaService } from "../Interface/Qa/IqaService";


class qaController implements IqaController {
  constructor(private _qaService: IqaService) { }

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
      console.log(typeof questionId, userType, 'controllerdata', questionId)

      const questId = new mongoose.Types.ObjectId(questionId as string) as unknown as mongoose.Schema.Types.ObjectId;


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
        `error while creating new Answer ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  //edit answer in mentee
  async editAnswer(req: Request, res: Response): Promise<void> {
    try {
      const { answerId, content } = req.body;

      const { status, message, success, answer } = await this._qaService.editAnswer(content, answerId);

      res.status(status).json({ success, message, answer });
    } catch (error: unknown) {
      throw new Error(
        `error while edit Answer ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async deleteQuestion(req: Request, res: Response): Promise<void> {
    try {
      const { questionId } = req.params;

      const { status, success, message } =
        await this._qaService.deleteQuestion(questionId);

      res.status(status).json({ success, message });


    } catch (error: unknown) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
      throw new Error(
        `Error while delete questions ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async allQaData(req: Request, res: Response): Promise<void> {
    try {
      const {
        search = '',
        Status = 'all',
        sortField = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 8
      } = req.query;

      const searchStr = typeof search === 'string' ? search : String(search);
      const statusStr = typeof Status === 'string' ? Status : String(Status);
      const sortFieldStr = typeof sortField === 'string' ? sortField : String(sortField);
      const sortOrderStr = typeof sortOrder === 'string' ? sortOrder : String(sortOrder);
      const pageStr = typeof page === 'string' ? page : String(page);
      const limitStr = typeof limit === 'string' ? limit : String(limit);
      console.log(search, ':search', 'status:', Status, 'sortField:', sortField, 'sortOrder:', sortOrder, 'page:', page, 'limit:', limit,);


      const { message, success, status, questions, docCount } = await this._qaService.allQaData(searchStr, statusStr, sortFieldStr, sortOrderStr, pageStr, limitStr);


      res.status(status).json({ message, status, success, questions, docCount })
    } catch (error: unknown) {
      throw new Error(
        `Error while getting all QA data ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  //qa status change admin 
  // /admin/qa-management/change-question-status
  async blockQuestion(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._qaService.changeQuestionStatus(
        req.body?.questionId
      );
      res
        .status(result.status)
        .json({ success: result?.success, message: result?.message,result:result?.result });
    } catch (error:unknown) {
      throw new Error(
        `error while edit qa status ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async blockAnswer(req: Request, res: Response): Promise<void> {

      try {
        const result = await this._qaService.changeAnswerStatus(
          req.body?.answerId
        );
        console.log(result.result)
        res
          .status(result.status)
          .json({ success: result?.success, message: result?.message,result:result?.result });
      } catch (error:unknown) {
        throw new Error(
          `error while edit answer status ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
  }
}
export default qaController;
