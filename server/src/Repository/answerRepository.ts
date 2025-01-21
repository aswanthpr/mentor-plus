import { IanswerRepository } from "../Interface/Qa/IanswerRepository";
import answerModel, { Ianswer } from "../Model/answerModel";
import { BaseRepository } from "./baseRepo";
import { ObjectId } from "mongoose";

class answerRespository
  extends BaseRepository<Ianswer>
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
    } catch (error: unknown) {
      throw new Error(
        `Error occured while create answer ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
export default new answerRespository();
