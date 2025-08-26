import { Ireview } from "../../Model/reviewModel";
import { baseRepository } from "../baseRepo";
import { IreviewRepository } from "../interface/IreviewRepository";
import { ObjectId } from "mongoose";
declare class reviewRepository extends baseRepository<Ireview> implements IreviewRepository {
    constructor();
    reviewNdRateMentor(newReview: Partial<Ireview>): Promise<Ireview | null>;
    findReivewAndUpdate(menteeId: ObjectId, mentorId: ObjectId, feedback: string, rating: number, sessionId: ObjectId): Promise<Ireview | null>;
    findReivew(menteeId: ObjectId, mentorId: ObjectId): Promise<Ireview | null>;
}
declare const _default: reviewRepository;
export default _default;
//# sourceMappingURL=reviewRepository.d.ts.map