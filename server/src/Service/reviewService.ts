import { Ireview } from "../Model/reviewModel";
import { IreviewRepository } from "../Interface/Review/IreviewRepository";
import { IreviewService } from "../Interface/Review/IreviewService";
import { Status } from "../Constants/httpStatusCode";
import mongoose from "mongoose";
import { HttpResponse } from "../Constants/httpResponse";
import { HttpError } from "../Utils/index";
export class reviewService implements IreviewService {
  constructor(
    private readonly __reviewRepository: IreviewRepository,

  ) {}

  async reviewNdRateMentor(
    rating: number,
    review: string,
    sessionId: string,
    menteeId: string,
    mentorId: string
  ): Promise<{
    message: string;
    status: number;
    success: boolean;
    feedback: Ireview | null;
    oldReview?:string
  }> {
    try {
      if (!review||!rating || !sessionId || !menteeId || !mentorId) {
        return {
          message:  HttpResponse?.INVALID_CREDENTIALS,
          status: Status?.BadRequest,
          success: false,
          feedback: null,
        };
      }
      const mentor_Id = new mongoose.Types.ObjectId(
        mentorId
      ) as unknown as mongoose.Schema.Types.ObjectId;
      const mentee_Id = new mongoose.Types.ObjectId(
        menteeId
      ) as unknown as mongoose.Schema.Types.ObjectId;
      const session_Id = new mongoose.Types.ObjectId(
        sessionId
      ) as unknown as mongoose.Schema.Types.ObjectId;
      const response = await this.__reviewRepository.findReivew(mentee_Id,mentor_Id);
      let updatedData:Ireview|null=null;
      if(response){

      updatedData = await this.__reviewRepository?.findReivewAndUpdate(mentee_Id,mentor_Id,review,rating,session_Id); 
      }
      let result:Ireview|null = null
      if(!response){
        const newReviewRating: Partial<Ireview> = {
        mentorId: mentor_Id,
        menteeId: mentee_Id,
        sessionId: session_Id,
        rating,
        feedback: review,
      };

       result = await this.__reviewRepository?.reviewNdRateMentor(
        newReviewRating
      );

      if (!result) {
        return {
          message: HttpResponse?.REVIEW_NOT_CREATED ,
          status: Status?.NotFound,
          success: false,
          feedback: null,
        };
      }
      }


      return {
        message: HttpResponse?.REVIEW_CREATED,
        status: Status?.Ok,
        success: true,
        feedback: result??updatedData,
        oldReview:String(response?._id) 
      };
    } catch (error: unknown) {
          throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
}
