import { IanswerRepository } from "../Interface/Qa/IanswerRepository";
import answerModel, { Ianswer } from "../Model/answerModel";
import { baseRepository } from "./baseRepo";
import { DeleteResult, ObjectId } from "mongoose";

class answerRespository
  extends baseRepository<Ianswer>
  implements IanswerRepository
{
  constructor() {
    super(answerModel);
  }
  async createNewAnswer(
    answer: string,
    questionId: ObjectId,
    userId: ObjectId,
    userType: string
  ): Promise<Ianswer | null> {
    try {
      return this.createDocument({
        answer,
        questionId,
        authorId: userId,
        authorType: userType,
      });
      // return ( await res).populate('authorId','name _id profileUrl githubUrl likedinUrl')
    } catch (error: unknown) {
      throw new Error(
        `Error occured while create answer ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async editAnswer(content: string, answerId: string): Promise<Ianswer | null> {
    try {
      return this.find_By_Id_And_Update(answerModel,answerId,{$set:{answer:content}})
    } catch (error:unknown) {
      throw new Error(
        `Error occured while edit answer ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async deleteAnswer(questionId: string): Promise<DeleteResult | undefined> {
    try {
      return this.deleteMany({questionId})
    } catch (error:unknown) {
      throw new Error(
        `Error occured while delete answer ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
    async changeAnswerStatus(answerId: string): Promise<Ianswer | null> {
      try {
        return this.find_By_Id_And_Update(answerModel,answerId,[
          { $set: { isBlocked: { $not: "$isBlocked" } } },
        ])
      } catch (error:unknown) {
        throw new Error(
          `Error occured while Question STatus chagne ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }
}
export default new answerRespository(); 
  