
import { ObjectId } from "mongoose";
import { Imessage } from "../../Model/messageModel";

export interface ImessageRepository{
    getMessage(chatId:ObjectId):Promise<Imessage[]|[]>;
    createMessage(data:Partial<Imessage>):Promise<Imessage|null>
    
}