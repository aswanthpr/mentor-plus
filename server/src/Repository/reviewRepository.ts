import reviewModel, { Ireview } from "../Model/reviewModel";
import { baseRepository } from "./baseRepo";
import { IreviewRepository } from "../Interface/Review/IreviewRepository";
import { ObjectId } from "mongoose";

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

    async findReivewAndUpdate(menteeId: ObjectId, mentorId: ObjectId,feedback:string,rating:number,sessionId:ObjectId): Promise<Ireview | null> {
        try {
            return this.find_One_And_Update(reviewModel, {menteeId,mentorId},{$set:{feedback,rating,sessionId}})
           
        } catch (error:unknown) {
            throw new Error(
                `Error while review and rating  ${
                  error instanceof Error ? error.message : String(error)
                }`
              );
        }
    }
    async findReivew(menteeId: ObjectId, mentorId: ObjectId,): Promise<Ireview | null> {
        try {
            return this.find_One({menteeId,mentorId})
           
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