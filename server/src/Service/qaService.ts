import { ObjectId } from "mongoose";
import { IanswerRepository } from "../Interface/Qa/IanswerRepository";
import { IqaService } from "../Interface/Qa/IqaService";
import { IquestionRepository } from "../Interface/Qa/IquestionRepository";
import { Iquestion } from "../Model/questionModal";
import { IanswerWithQuestion, IcreateQuestion } from "../Types";
import { Status } from "../Constants/httpStatusCode";
import { InotificationRepository } from "../Interface/Notification/InotificationRepository";
import { socketManager } from "../index";
import { Inotification } from "../Model/notificationModel";
import { HttpResponse } from "../Constants/httpResponse";
import { HttpError ,createSkip} from "../Utils/index";

class qaService implements IqaService {
  constructor(
    private readonly __questionRepository: IquestionRepository,
    private readonly __answerRepository: IanswerRepository,
    private readonly __notificationRepository: InotificationRepository
  ) { }

  async addQuestionService(
    Data: IcreateQuestion,
    userId: ObjectId
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    question: Iquestion | undefined;
  }> {
    try {
      const { title, content, tags } = Data;

      if (
        !title ||
        !content ||
        !Array.isArray(tags) ||
        !userId
      ) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status?.BadRequest,
          question: undefined,
        };
      }
      const result = await this.__questionRepository.isQuestionExist(
        title,
        content
      );
      if (!result) {
        return {
          success: false,
          message: HttpResponse?.QUESTION_EXIST,
          status: Status?.Conflict,
          question: undefined,
        };
      }
      const response = await this.__questionRepository.createQuestion(
        title,
        content,
        tags,
        userId
      );
      if (!response) {
        return {
          success: false,
          message: "Unexpected error occured",
          status: Status?.BadRequest,
          question: undefined,
        };
      }

      return {
        success: true,
        message: HttpResponse?.SUCCESS,
        status: Status?.Ok,
        question: response,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }

  async questionData(

    userId: ObjectId,
    filter: string,
    search: string,
    sortField: string,
    sortOrder: string,
    limit: number,
    page: number
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    question: Iquestion[];
    userId?: ObjectId;
    totalPage: number;
  }> {
    try {
      if (!userId || !filter || !sortField || !sortOrder || 1 > limit || 1 > page) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status?.BadRequest,
          question: [],
          totalPage: 0,
        };
      }
      const skipData = createSkip(page, limit);
      const limitNo = skipData?.limitNo;
      const skip = skipData?.skip;
      const response = await this.__questionRepository.questionData(
        userId,
        filter,
        search,
        limitNo,
        skip,
        sortField,
        sortOrder,

      );
     
      const totalPage = Math.ceil(response?.totalDocs / limitNo);
      return {
        success: true,
        message: HttpResponse?.DATA_RETRIEVED,
        status: Status?.Ok,
        question: response?.questions,
        userId,
        totalPage
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }

  async editQuestion(
    questionId: string,
    updatedQuestion: Iquestion,
    filter: string
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    question: Iquestion[] | null;
  }> {
    try {
      if (!questionId || !updatedQuestion || !filter) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status?.BadRequest,
          question: null,
        };
      }

      const response = await this.__questionRepository.editQuestions(
        questionId,
        updatedQuestion,
        filter
      );

      return {
        success: true,
        message: HttpResponse?.SUCCESS,
        status: Status?.Ok,
        question: response,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
  async createNewAnswer(
    answer: string,
    questionId: ObjectId,
    userId: ObjectId,
    userType: string
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    answers: IanswerWithQuestion | null;
  }> {
    try {
      if (!answer || !questionId || !userId || !userType) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status.BadRequest,
          answers: null,
        };
      }
      const response = await this?.__answerRepository.createNewAnswer(
        answer,
        questionId,
        userId,
        userType
      );

      if (!response?.menteeId || !response?.result) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status.NotFound,
          answers: null,
        };
      }

      if (userId !== response?.menteeId) {
        const notif = await this.__notificationRepository.createNotification(
          response?.menteeId,
          "You've Got a New Answer!",
          "Good news! you got replied to your question ",
          "mentee",
          `${process.env.CLIENT_ORIGIN_URL}/mentee/qa`
        );
        const user_Id = String(response?.menteeId);
        socketManager.sendNotification(user_Id, notif as Inotification);
      }
      const questId = questionId as unknown as string;

      const result = await this.__questionRepository.countAnswer(questId);
 
      if (!result) {
        return {
          success: false,
          message: HttpResponse?.FAILED,
          status: Status.NotFound,
          answers: null,
        };
      }

      return {
        success: true,
        message: HttpResponse?.SUCCESS,
        status: Status.Ok,
        answers: response?.result,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
  async editAnswer(
    content: string,
    answerId: string
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    answer: string | null;
  }> {
    try {
      if (!answerId || !content) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status.BadRequest,
          answer: null,
        };
      }

      const result = await this.__answerRepository.editAnswer(
        content,
        answerId
      );
     
      if (!result) {
        return {
          success: false,
          message: HttpResponse?.RESOURCE_NOT_FOUND,
          status: Status.NotFound,
          answer: null,
        };
      }
      return {
        success: true,
        message: HttpResponse?.SUCCESS,
        status: Status.Ok,
        answer: result?.answer,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
  async deleteQuestion(
    questionId: string
  ): Promise<{ success: boolean; message: string; status: number }> {
    try {
      // Validate input
      if (!questionId) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status.BadRequest,
        };
      }
      const response = await this.__questionRepository.deleteQuestion(
        questionId
      );


      if (!response || response.deletedCount !== 1) {
        return {
          success: false,
          message: HttpResponse?.RESOURCE_NOT_FOUND,
          status: Status.NotFound,
        };
      }
      //reducing the count of answers after delete the document
      await this.__questionRepository.reduceAnswerCount(questionId);
      //Delete the quesiton with its answer
      await this.__answerRepository.deleteAnswer(questionId);


      return {
        success: true,
        message: HttpResponse?.DATA_RETRIEVED,
        status: Status.Ok,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }

  //this is for admin side qa-management
  // /admin/qa-management

  async allQaData(
    search: string,
    status: string,
    sortField: string,
    sortOrder: string,
    page: number,
    limit: number
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    questions: Iquestion[] | undefined;
    totalPage: number | undefined;
  }> {
    try {
      if (!status || !sortField || !sortOrder || page < 1 || limit < 1) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status.BadRequest,
          questions: undefined,
          totalPage: undefined,
        };
      }
      const skipData = createSkip(page, limit);
      const limitNo = skipData?.limitNo;
      const skip = skipData?.skip

      const response = await this.__questionRepository.allQaData(
        skip,
        search,
        status,
        limitNo,
        sortOrder,
        sortField
      );

      const totalPage = Math.ceil((response?.docCount as number) / limitNo);
     
      return {
        success: true,
        message: HttpResponse?.DATA_RETRIEVED,
        status: Status.Ok,
        questions: response?.questions,
        totalPage,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }

  async changeQuestionStatus(
    questionId: string
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    result?: boolean;
  }> {
    try {
      if (!questionId) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status.BadRequest,
        };
      }
      const result = await this.__questionRepository.changeQuestionStatus(
        questionId
      );
      if (!result) {
        return {
          success: false,
          message: HttpResponse?.RESOURCE_NOT_FOUND,
          status: Status.NotFound,
        };
      }
      
      return {
        success: true,
        message: HttpResponse?.SUCCESS,
        status: Status.Ok,
        result: result?.isBlocked,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
  //answer status change in admin
  ///admin/qa-management/change-answer-status/
  async changeAnswerStatus(
    answerId: string
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    result?: boolean;
  }> {
    try {
      if (!answerId) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status.BadRequest,
        };
      }

      const result = await this.__answerRepository.changeAnswerStatus(answerId);
      if (!result) {
        return {
          success: false,
          message: HttpResponse?.RESOURCE_NOT_FOUND,
          status: Status.NotFound,
        };
      }
      return {
        success: true,
        message: HttpResponse?.SUCCESS,
        status: Status.Ok,
        result: result?.isBlocked,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
}

export default qaService;
