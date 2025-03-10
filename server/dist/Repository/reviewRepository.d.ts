import { Ireview } from "../Model/reviewModel";
import { baseRepository } from "./baseRepo";
import { IreviewRepository } from "../Interface/Review/IreviewRepository";
declare class reviewRepository extends baseRepository<Ireview> implements IreviewRepository {
    constructor();
    reviewNdRateMentor(newReview: Partial<Ireview>): Promise<Ireview | null>;
}
declare const _default: reviewRepository;
export default _default;
//# sourceMappingURL=reviewRepository.d.ts.map