import { ObjectId } from "mongoose";
import { Ireview } from "../../Model/reviewModel";

export interface IreviewRepository {
    reviewNdRateMentor(newReview:Partial<Ireview>):Promise<Ireview|null>;
    findReivewAndUpdate(menteeId:ObjectId,mentorId:ObjectId,feedback:string,rating:number,sessionId:ObjectId):Promise<Ireview|null>;
    findReivew(menteeId: ObjectId, mentorId: ObjectId,): Promise<Ireview | null> 
}