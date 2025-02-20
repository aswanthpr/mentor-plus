
import { Imessage } from "../../Model/messageSchema";

export interface ImessageRepository{
    getMessage():Promise<Imessage[]|[]>
    
}