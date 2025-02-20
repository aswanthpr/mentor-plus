import { ObjectId } from "mongoose";
import { Ichat } from "../../Model/chatSchema";


export interface IchatRepository {
getMenteechats(userId:ObjectId):Promise<Ichat[]|[]>
getMentorchats(userId:ObjectId):Promise<Ichat[]|[]>
}