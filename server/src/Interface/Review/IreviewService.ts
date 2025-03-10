import { Ireview } from "src/Model/reviewModel";

export interface IreviewService{
    reviewNdRateMentor(rating:number,review:string,sessionId:string,role:string,menteeId:string,mentorId:string):Promise<{message:string,status:number,success:boolean,feedback:Ireview|null}>;

}