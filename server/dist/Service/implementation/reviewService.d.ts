import { Ireview } from "../../Model/reviewModel";
import { IreviewRepository } from "../../Repository/interface/IreviewRepository";
import { IreviewService } from "../interface/IreviewService";
export declare class reviewService implements IreviewService {
    private readonly __reviewRepository;
    constructor(__reviewRepository: IreviewRepository);
    reviewNdRateMentor(rating: number, review: string, sessionId: string, menteeId: string, mentorId: string): Promise<{
        message: string;
        status: number;
        success: boolean;
        feedback: Ireview | null;
        oldReview?: string;
    }>;
}
//# sourceMappingURL=reviewService.d.ts.map