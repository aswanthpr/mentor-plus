import { NextFunction, Request, Response } from "express";
import { IreviewController } from "../interface/IreviewController";
import { IreviewService } from "../../Service/interface/IreviewService";

export class reviewController implements IreviewController {
  constructor(private readonly __reviewService: IreviewService) {}

  async reviewNdRateMentor(req: Request, res: Response,next: NextFunction): Promise<void> {
    try {
      const { rating, review, sessionId, menteeId, mentorId } = req.body;
     
      const { status, message, success, feedback,oldReview } =
        await this.__reviewService.reviewNdRateMentor(
         rating,
          review,
          sessionId,
          menteeId,
          mentorId

        );
      res.status(status).json({ message, success, feedback,oldReview });
    } catch (error: unknown) {
      next(error)
    }
  }
}
