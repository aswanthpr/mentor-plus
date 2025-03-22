import { ObjectId } from "mongoose";
import { IanswerRepository } from "../Interface/Qa/IanswerRepository";
import { IqaService } from "../Interface/Qa/IqaService";
import { IquestionRepository } from "../Interface/Qa/IquestionRepository";
import { Iquestion } from "../Model/questionModal";
import { IanswerWithQuestion, IcreateQuestion } from "../Types";
import { Status } from "../Utils/httpStatusCode";
import { InotificationRepository } from "../Interface/Notification/InotificationRepository";
import { socketManager } from "../index";
import { Inotification } from "../Model/notificationModel";
import { createSkip } from "../Utils/reusable.util";

class qaService implements IqaService {
  constructor(
    private readonly __questionRepository: IquestionRepository,
    private readonly __answerRepository: IanswerRepository,
    private readonly __notificationRepository: InotificationRepository
  ) {}

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
          message: "Invalid input: title, content, and tags are required",
          status: 400,
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
          message: "Question exist",
          status: 400,
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
          status: 400,
          question: undefined,
        };
      }

      return {
        success: true,
        message: "Question created Successfully!",
        status: 200,
        question: response,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error during creating question${
          error instanceof Error ? error.message : String(error)
        }`
      );
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
      if (!userId || !filter|| !sortField|| !sortOrder|| 1>limit|| 1>page) {
        return {
          success: false,
          message: "credential missing",
          status: 400,
          question: [],
          totalPage:0,
        };
      }
      const skipData = createSkip(page,limit);
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
      const totalPage = Math.ceil(response?.totalDocs/limitNo);
      return {
        success: true,
        message: "Data retrieved successfully",
        status: 200,
        question: response?.questions,
        userId,
        totalPage
      };
    } catch (error: unknown) {
      throw new Error(
        `Error during get questions ${
          error instanceof Error ? error.message : String(error)
        }`
      );
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
          message: "Invalid input: title, content, and tags are required",
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
        message: "Edit Successfully!",
        status: Status?.Ok,
        question: response,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error during edit questions ${
          error instanceof Error ? error.message : String(error)
        }`
      );
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
          message: "Credential missing",
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
          message: "Answer not saved !unexpected error",
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
      console.log(
        response,
        "thsi is the respnose of answer tha tcreated me ",
        result
      );
      if (!result) {
        return {
          success: false,
          message: "Unexpected Error ! answer not created",
          status: Status.NotFound,
          answers: null,
        };
      }

      return {
        success: true,
        message: "Answer Created Successfully",
        status: Status.Ok,
        answers: response?.result,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error during create answer ${
          error instanceof Error ? error.message : String(error)
        }`
      );
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
          message: "Credential missing",
          status: Status.BadRequest,
          answer: null,
        };
      }

      const result = await this.__answerRepository.editAnswer(
        content,
        answerId
      );
      console.log(result, "this is result");
      if (!result) {
        return {
          success: false,
          message: "Data not found",
          status: Status.NotFound,
          answer: null,
        };
      }
      return {
        success: true,
        message: "edited successfully",
        status: Status.Ok,
        answer: result?.answer,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error during edit answer ${
          error instanceof Error ? error.message : String(error)
        }`
      );
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
          message: "Question ID is required",
          status: Status.BadRequest,
        };
      }
      const response = await this.__questionRepository.deleteQuestion(
        questionId
      );

      // Check if the deletion was successful
      if (!response || response.deletedCount !== 1) {
        return {
          success: false,
          message: "Question not found or could not be deleted",
          status: Status.NotFound,
        };
      }
      //reducing the count of answers after delete the document
      await this.__questionRepository.reduceAnswerCount(questionId);
      //Delete the quesiton with its answer
      await this.__answerRepository.deleteAnswer(questionId);

      //returning the success response
      return {
        success: true,
        message: "Data successfully fetched",
        status: Status.Ok,
      };
    } catch (error: unknown) {
      //console the error
      console.error(
        //using different color in terminal to show the error
        "\x1b[34m%s\x1b[0m",
        "Error while getting home data:",
        error instanceof Error ? error.message : String(error)
      );
      //internal server error response
      return {
        success: false,
        message: "Internal server error",
        status: Status.InternalServerError,
      };
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
          message: "Invalid pagination or missing parameters",
          status: Status.BadRequest,
          questions: undefined,
          totalPage: undefined,
        };
      }
      const skipData = createSkip(page,limit);
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
      console.log(response?.docCount, totalPage, limit, skip, page);
      return {
        success: true,
        message: "data fetched successfully",
        status: Status.Ok,
        questions: response?.questions,
        totalPage,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error during fetch all data to admin ${
          error instanceof Error ? error.message : String(error)
        }`
      );
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
          message: "credential is missing",
          status: Status.BadRequest,
        };
      }
      const result = await this.__questionRepository.changeQuestionStatus(
        questionId
      );
      if (!result) {
        return {
          success: false,
          message: "Question not found",
          status: Status.NotFound,
        };
      }
      return {
        success: true,
        message: "Status changed successfully",
        status: Status.Ok,
        result: result?.isBlocked,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error while change category status in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
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
          message: "credential is missing",
          status: Status.BadRequest,
        };
      }

      const result = await this.__answerRepository.changeAnswerStatus(answerId);
      if (!result) {
        return {
          success: false,
          message: "answer not found",
          status: Status.NotFound,
        };
      }
      return {
        success: true,
        message: "Status changed successfully",
        status: Status.Ok,
        result: result?.isBlocked,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error while change answer status admin side: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}

export default qaService;
