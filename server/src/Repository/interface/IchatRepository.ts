import { ObjectId } from "mongoose";
import { Ichat } from "../../Model/chatModel";
import { Imessage } from "../../Model/messageModel";


export interface IchatRepository {
getMenteechats(userId:ObjectId):Promise<Ichat[]|[]>
getMentorchats(userId:ObjectId):Promise<Ichat[]|[]>;
createChatDocs(mentorId:ObjectId,menteeId:ObjectId):Promise<Ichat|null>;
getUserMessage(chatId:string):Promise<Imessage[]|[]>;
findChatRoom(mentorId:ObjectId,menteeId:ObjectId):Promise<Ichat|null>
}