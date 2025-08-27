import { ObjectId } from "mongoose";
import { Ichat } from "../../Model/chatModel";
import { Imessage } from "../../Model/messageModel";

export interface IchatService{
    getChats(userId:ObjectId,role:string):Promise<{success:boolean;message:string;status:number;result:Ichat[]|[]}>;
    getUserMessage(chatId:string): Promise<{success:boolean,status:number,message:string,result:Imessage[] | []}> ;

}