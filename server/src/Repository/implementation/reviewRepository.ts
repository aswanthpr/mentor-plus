import  {reviewSchema, Ireview } from "../../Model/index";
import { baseRepository } from "../baseRepo";
import { IreviewRepository } from "../interface/IreviewRepository";
import { ObjectId } from "mongoose";
import { Status } from "../../Constants/httpStatusCode";
import { HttpError } from "../../Utils/index";

class reviewRepository
  extends baseRepository<Ireview>
  implements IreviewRepository
{
  constructor() {
    super(reviewSchema);
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
        reviewSchema,
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
