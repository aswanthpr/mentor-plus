import { DeleteResult, ObjectId } from "mongoose";
import { Iquestion } from "src/Model/questionModal";

export interface IquestionRepository {
  createQuestion(
    title: string,
    content: string,
    tags: string[],
    userId: ObjectId
  ): Promise<Iquestion | null>;
  getQuestionData(menteeId: ObjectId, filter: string): Promise<Iquestion[]>;
  editQuestions(
    questionId: string,
    updatedQuestion: Iquestion
  ): Promise<Iquestion | null>;
  allQuestionData(filter: string): Promise<Iquestion[] | null>;
  deleteQuestion(questionId: string): Promise<DeleteResult | undefined>;
  countAnswer(questionId:string):Promise<Iquestion|null>
  reduceAnswerCount(questionId: string): Promise<Iquestion | null>
  
}
