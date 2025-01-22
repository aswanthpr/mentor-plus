import { ObjectId} from "mongoose";
import { IanswerRepository } from "../Interface/Qa/IanswerRepository";
import { IqaService } from "../Interface/Qa/IqaService";
import { IquestionRepository } from "src/Interface/Qa/IquestionRepository";
import { Ianswer } from "../Model/answerModel";
import { Iquestion } from "../Model/questionModal";
import { IcreateQuestion } from "../Types";


class qaService implements IqaService {
  constructor(
    private __questionRepository: IquestionRepository,
    private  __answerRepository:IanswerRepository
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
        `Error during get questions ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async editQuestion(
    questionId: string,
    updatedQuestion: Iquestion
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    question: Iquestion | null;
  }> {
    try {
      if (!questionId || !updatedQuestion) {
        return {
          success: false,
          message: "Invalid input: title, content, and tags are required",
          status: 400,
          question: null,
        };
      }
      const response = await this.__questionRepository.editQuestions(
        questionId,
        updatedQuestion
      );
      
      return {
        success: true,
        message: "Edit Successfully!",
        status: 200,
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
    answers: Ianswer | null;
  }> {
    try {
      console.log(answer,questionId,userId ,userType,'567456757567')
      if (!answer || !questionId || !userId || !userType) {
        return {
          success: false,
          message: "Credential missing",
          status: 400,
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
      if(!response){
        return {
          success: false,
          message: "Answer not saved !unexpected error",
          status: 404,
          answers: null,
        };
      }
      const  questId =  questionId as unknown as string;
      console.log(questId,'thsi si the question id object to string converted ',typeof questId,questionId,'555555555555555555555555555')
      const result = await this.__questionRepository.countAnswer(questId)
      console.log(response ,'thsi is the respnose',result)
if(!response){
    return {
    success: false,
    message: "Unexpected Error ! answer not created",
    status: 404,
    answers: null,
    }
}
return {
    success: true,
    message: "Answer Created Successfully",
    status: 200,
    answers: response,
    }

    } catch (error: unknown) {
      throw new Error(
        `Error during create answer ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}

export default qaService;
