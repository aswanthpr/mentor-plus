import { Request, Response } from "express";
import { IreviewController } from "../Interface/Review/IreviewController";
import { IreviewService } from "../Interface/Review/IreviewService";

export class reviewController implements IreviewController {
  constructor(private readonly __reviewService: IreviewService) {}

  async reviewNdRateMentor(req: Request, res: Response): Promise<void> {
    try {
      const { rating, review, sessionId, role, menteeId, mentorId } = req.body;
     
      const { status, message, success, feedback } =
        await this.__reviewService.reviewNdRateMentor(
         rating,
          review,
          sessionId,
          role,
          menteeId,
          mentorId
        );
      res.status(status).json({ message, success, feedback });
    } catch (error: unknown) {
      throw new Error(
        `Error while  webhook config ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
