import { Ireview } from "../Model/reviewModel";
import { IreviewRepository } from "../Interface/Review/IreviewRepository";
import { IreviewService } from "../Interface/Review/IreviewService";
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