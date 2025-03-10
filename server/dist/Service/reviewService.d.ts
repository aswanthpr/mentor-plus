import { Ireview } from "../Model/reviewModel";
import { IreviewRepository } from "../Interface/Review/IreviewRepository";
import { IreviewService } from "../Interface/Review/IreviewService";
import { InotificationRepository } from "../Interface/Notification/InotificationRepository";
export declare class reviewService implements IreviewService {
    private readonly __reviewRepository;
    private readonly _notificationRepository;
    constructor(__reviewRepository: IreviewRepository, _notificationRepository: InotificationRepository);
    reviewNdRateMentor(rating: number, review: string, sessionId: string, role: string, menteeId: string, mentorId: string): Promise<{
        message: string;
        status: number;
        success: boolean;
        feedback: Ireview | null;
    }>;
}
//# sourceMappingURL=reviewService.d.ts.map