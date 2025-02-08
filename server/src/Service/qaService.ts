import { ObjectId } from "mongoose";
import { IanswerRepository } from "../Interface/Qa/IanswerRepository";
import { IqaService } from "../Interface/Qa/IqaService";
import { IquestionRepository } from "../Interface/Qa/IquestionRepository";
import { Ianswer } from "../Model/answerModel";
import { Iquestion } from "../Model/questionModal";
import { IcreateQuestion } from "../Types";
import { Status } from "../Utils/httpStatusCode";



class qaService implements IqaService {
  constructor(
    private __questionRepository: IquestionRepository,
    private __answerRepository: IanswerRepository
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
        !Data ||
        !Data.title ||
        !Data.content ||
        !Array.isArray(Data.tags) ||
        !userId
      ) {
        return {
          success: false,
          message: "Invalid input: title, content, and tags are required",
          status: 400,
          question: undefined,
        };
      }
      const result = await this.__questionRepository.isQuestionExist(title, content)
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
        `Error during creating question${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async questionData(
    userId: ObjectId,
    filter: string
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    question: Iquestion[];
    userId?: ObjectId;
  }> {
    try {
      if (!userId || !filter) {
        return {
          success: false,
          message: "credential missing",
          status: 400,
          question: [],
        };
      }
      const response = await this.__questionRepository.questionData(
        userId,
        filter
      );
      console.log(response, "this is the response");
      return {
        success: true,
        message: "Data retrieved successfully",
        status: 200,
        question: response,
        userId,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error during get questions ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async editQuestion(
    questionId: string,
    updatedQuestion: Iquestion,
    filter:string,
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    question: Iquestion[] | null;
  }> {
    try {
      if (!questionId || !updatedQuestion||!filter) {
        return {
          success: false,
          message: "Invalid input: title, content, and tags are required",
          status: 400,
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
        status: 200,
        question:response,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error during edit questions ${error instanceof Error ? error.message : String(error)
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
    answers: Ianswer | null;
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

      const response = await this.__answerRepository
        .createNewAnswer(
          answer,
          questionId,
          userId,
          userType
        );
      if (!response) {
        return {
          success: false,
          message: "Answer not saved !unexpected error",
          status: Status.NotFound,
          answers: null,
        };
      }
      const questId = questionId as unknown as string;

      const result = await this.__questionRepository.countAnswer(questId)
      console.log(response, 'thsi is the respnose of answer tha tcreated me ', result)
      if (!response) {
        return {
          success: false,
          message: "Unexpected Error ! answer not created",
          status: Status.NotFound,
          answers: null,
        }
      }
      return {
        success: true,
        message: "Answer Created Successfully",
        status: Status.Ok,
        answers: response,
      }

    } catch (error: unknown) {
      throw new Error(
        `Error during create answer ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async editAnswer(content: string, answerId: string): Promise<{ success: boolean; message: string; status: number; answer: string | null; }> {
    try {
      if (!answerId || !content) {
        return {
          success: false,
          message: "Credential missing",
          status: Status.BadRequest,
          answer: null,
        };
      }

      const result = await this.__answerRepository.editAnswer(content, answerId);
      console.log(result, 'this is result');
      if (!result) {
        return {
          success: false,
          message: "Data not found",
          status: Status.NotFound,
          answer: null,
        };
      }
      return { success: true, message: 'edited successfully', status: Status.Ok, answer: result?.answer };

    } catch (error: unknown) {
      throw new Error(
        `Error during edit answer ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async deleteQuestion(questionId: string): Promise<{ success: boolean; message: string; status: number; }> {
    try {
      // Validate input
      if (!questionId) {
        return {
          success: false,
          message: "Question ID is required",
          status: Status.BadRequest,
        };
      }
      const response = await this.__questionRepository.deleteQuestion(questionId);

      // Check if the deletion was successful
      if (!response || response.deletedCount !== 1) {
        return {
          success: false,
          message: "Question not found or could not be deleted",
          status: Status.NotFound,
        };
      }
      //reducing the count of answers after delete the document
      await this.__questionRepository.reduceAnswerCount(questionId)
      //Delete the quesiton with its answer
      await this.__answerRepository.deleteAnswer(questionId)

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

  async allQaData(search: string, status: string, sortField: string, sortOrder: string, page: string, limit: string): Promise<{ success: boolean; message: string; status: number; questions: Iquestion[] | undefined, docCount: number | undefined }> {
    try {
      console.log(search, status, sortField, sortOrder, page, limit)
      if (!status || !sortField ||
        !sortOrder || !page || !limit) {
        return {
          success: false,
          message: 'credentials are missing',
          status: Status.BadRequest,
          questions: undefined,
          docCount: undefined
        }
      }

      // let  pages  = parseInt(page, 10) || 1 ;
      // const limits = parseInt(limit, 10) || 10;
      // const skip = (parseInt(pages) - 1) * parseInt(limits);
      // pages = Math.max(pages, 1);
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const respnose = await this.__questionRepository.allQaData(skip, search, status, limit, sortOrder, sortField);
console.log(respnose,'thsi si rea')
      return {
        success: true,
        message: "data fetched successfully",
        status: Status.Ok,
        questions: respnose?.questions,
        docCount: respnose?.docCount
      }
    } catch (error: unknown) {
      throw new Error(
        `Error during fetch all data to admin ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async changeQuestionStatus(questionId: string): Promise<{ success: boolean; message: string; status: number; result?: boolean; }> {
    try {
      if (!questionId) {
        return {
          success: false,
          message: "credential is missing",
          status: Status.BadRequest,
    
        };
      }
      const result = await this.__questionRepository.changeQuestionStatus(questionId);
      if (!result) {
        return { success: false, 
          message: "Question not found", 
          status: Status.NotFound };
      }
      return {
        success: true,
        message: "Status changed successfully",
        status: Status.Ok,
        result:result?.isBlocked
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
  async changeAnswerStatus(answerId: string): Promise<{ success: boolean; message: string; status: number; result?: boolean; }> {
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
        return { success: false, 
          message: "answer not found", 
          status: Status.NotFound };
      }
      return {
        success: true,
        message: "Status changed successfully",
        status: Status.Ok,
        result:result?.isBlocked
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
