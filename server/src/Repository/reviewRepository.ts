import reviewModel, { Ireview } from "../Model/reviewModel";
import { baseRepository } from "./baseRepo";
import { IreviewRepository } from "../Interface/Review/IreviewRepository";

class reviewRepository extends baseRepository<Ireview> implements IreviewRepository{
    constructor(){
        super(reviewModel)
    }

    async reviewNdRateMentor(newReview: Partial<Ireview>): Promise<Ireview | null> {
        try {
            return this.createDocument(newReview);
        } catch (error:unknown) {
            throw new Error(
                `Error while review and rating  ${
                  error instanceof Error ? error.message : String(error)
                }`
              );
        }
    }
}
export default new reviewRepository();