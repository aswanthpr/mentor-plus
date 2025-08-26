import { Ireview } from "../../Model/reviewModel";
export interface IreviewService {
    reviewNdRateMentor(rating: number, review: string, sessionId: string, menteeId: string, mentorId: string): Promise<{
        message: string;
        status: number;
        success: boolean;
        feedback: Ireview | null;
        oldReview?: string;
    }>;
}
//# sourceMappingURL=IreviewService.d.ts.map