import { ObjectId } from "mongoose";
import { Ichat } from "../../Model/chatSchema";

export interface IchatService{
    getChats(userId:ObjectId,role:string):Promise<{success:boolean;message:string;status:number;result:Ichat[]|[]}>
}