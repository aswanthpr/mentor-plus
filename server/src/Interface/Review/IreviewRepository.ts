import { Ireview } from "src/Model/reviewModel";

export interface IreviewRepository {
    reviewNdRateMentor(newReview:Partial<Ireview>):Promise<Ireview|null>
}