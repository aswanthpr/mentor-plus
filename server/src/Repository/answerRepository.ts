
import { IanswerWithQuestion } from "src/Types";
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
  ): Promise<{ result: IanswerWithQuestion | null; menteeId: ObjectId }> {
    try {
      const result = await (
        await this.createDocument({
          answer,
          questionId,
          authorId: userId,
          authorType: userType,
        })
      );

     const data =  await this.aggregateData(answerModel, [
       {
         $match: { questionId, _id: result?._id }
       },
       {
        $lookup: {
          from: "mentees",
          localField:"authorId",
          foreignField: "_id",
          as: "author",
       }
      },
      {
        $unwind: {
          path: "$author",
          preserveNullAndEmptyArrays: true,
        },
      },
       {
         $lookup: {
           from: "questions",
           localField: "questionId",
           foreignField: "_id",
           as: "question",
           pipeline: [{ $project: { menteeId: 1 } }],
         },
       },
       {
        $unwind: {
          path: "$question",
          preserveNullAndEmptyArrays: true,
        },
      },
       
     ]) as unknown as IanswerWithQuestion[] ;

      return {result: data[0] , menteeId:data[0]?.question?.menteeId as IanswerWithQuestion['question']['menteeId'] }
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
      return await this.find_By_Id_And_Update(answerModel, answerId, {
        $set: { answer: content },
      });
    } catch (error: unknown) {
      throw new Error(
        `Error occured while edit answer ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async deleteAnswer(questionId: string): Promise<DeleteResult | undefined> {
    try {
      return await this.deleteMany({ questionId });
    } catch (error: unknown) {
      throw new Error(
        `Error occured while delete answer ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async changeAnswerStatus(answerId: string): Promise<Ianswer | null> {
    try {
      return await this.find_By_Id_And_Update(answerModel, answerId, [
        { $set: { isBlocked: { $not: "$isBlocked" } } },
      ]);
    } catch (error: unknown) {
      throw new Error(
        `Error occured while Question STatus chagne ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
export default new answerRespository();
