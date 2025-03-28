import { NextFunction, Request, Response } from "express";
import { IreviewController } from "../Interface/Review/IreviewController";
import { IreviewService } from "../Interface/Review/IreviewService";
export declare class reviewController implements IreviewController {
    private readonly __reviewService;
    constructor(__reviewService: IreviewService);
    reviewNdRateMentor(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=reviewController.d.ts.map