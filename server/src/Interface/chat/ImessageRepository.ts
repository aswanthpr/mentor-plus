
import { Imessage } from "../../Model/messageSchema";

export interface ImessageRepository{
    getMessage():Promise<Imessage[]|[]>;
    createMessage(data:Partial<Imessage>):Promise<Imessage|null>
    
}