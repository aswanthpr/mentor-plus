import reviewModel, { Ireview } from "../Model/reviewModel";
import { baseRepository } from "./baseRepo";
import { IreviewRepository } from "../Interface/Review/IreviewRepository";
import { ObjectId } from "mongoose";
import { Status } from "../Constants/httpStatusCode";
import { HttpError } from "../Utils/http-error-handler.util";

class reviewRepository
  extends baseRepository<Ireview>
  implements IreviewRepository
{
  constructor() {
    super(reviewModel);
  }

  async reviewNdRateMentor(
    newReview: Partial<Ireview>
  ): Promise<Ireview | null> {
    try {
      return this.createDocument(newReview);
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
    }
  }

  async findReivewAndUpdate(
    menteeId: ObjectId,
    mentorId: ObjectId,
    feedback: string,
    rating: number,
    sessionId: ObjectId
  ): Promise<Ireview | null> {
    try {
      return this.find_One_And_Update(
        reviewModel,
        { menteeId, mentorId },
        { $set: { feedback, rating, sessionId } }
      );
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
    }
  }
  async findReivew(
    menteeId: ObjectId,
    mentorId: ObjectId
  ): Promise<Ireview | null> {
    try {
      return this.find_One({ menteeId, mentorId });
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
    }
  }
}
export default new reviewRepository();
