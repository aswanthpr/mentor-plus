import { Ireview } from "../Model/reviewModel";
import { IreviewRepository } from "../Interface/Review/IreviewRepository";
import { IreviewService } from "../Interface/Review/IreviewService";
import { Status } from "../Utils/httpStatusCode";
import mongoose from "mongoose";
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
          message: "credential not found",
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
          message: "whoops... ,review not created",
          status: Status?.NotFound,
          success: false,
          feedback: null,
        };
      }
      }

  console.log(response)
      return {
        message: "review created successfully",
        status: Status?.Ok,
        success: true,
        feedback: result??updatedData,
        oldReview:String(response?._id) 
      };
    } catch (error: unknown) {
      throw new Error(
        `Error while rateMentor ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
