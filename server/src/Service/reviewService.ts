import { Ireview } from "../Model/reviewModel";
import { IreviewRepository } from "../Interface/Review/IreviewRepository";
import { IreviewService } from "../Interface/Review/IreviewService";
import { Status } from "../Utils/httpStatusCode";
import mongoose from "mongoose";
import { InotificationRepository } from "../Interface/Notification/InotificationRepository";
import { socketManager } from "../index";

export class reviewService implements IreviewService {
  constructor(
    private readonly __reviewRepository: IreviewRepository,
    private readonly _notificationRepository: InotificationRepository
  ) {}

  async reviewNdRateMentor(
    rating: number,
    review: string,
    sessionId: string,
    role: string,
    menteeId: string,
    mentorId: string
  ): Promise<{
    message: string;
    status: number;
    success: boolean;
    feedback: Ireview | null;
  }> {
    try {
      if (!review || !sessionId || !role || !menteeId || !mentorId) {
        return {
          message: "credential not found",
          status: Status?.BadRequest,
          success: false,
          feedback: null,
        };
      }
      if (role == "mentee" && rating <= 0) {
        return {
          message: "rating cannot be zero",
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

      const newReviewRating: Partial<Ireview> = {
        mentorId: mentor_Id,
        menteeId: mentee_Id,
        sessionId: session_Id,
        rating,
        feedback: review,
        role,
      };

      const result = await this.__reviewRepository?.reviewNdRateMentor(
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

      const userId = role === "mentee" ? mentor_Id : mentee_Id;
      const userType = role === "mentee" ? "mentor" : "mentee";
      const message =
        role === "mentee"
          ? `you got a ${rating} star rating `
          : "you got a feedback from previous session ";
      const title = role === "mentee" ? "got a rating" : "got a feedback";

      const notif = await this._notificationRepository.createNotification(
        userId,
        title,
        message,
        userType,
        `${process.env.CLIENT_ORIGIN_URL}/${
          role == "mentee" ? `mentee/bookings` : ""
        }`
      );

      if (notif) {
        socketManager.sendNotification(String(userId), notif);
      }

      return {
        message: "review created successfully",
        status: Status?.Ok,
        success: true,
        feedback: result,
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
