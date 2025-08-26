import { ObjectId } from "mongoose";
import { Ichat } from "../../Model/chatSchema";
import { Imessage } from "../../Model/messageSchema";
export interface IchatService {
    getChats(userId: ObjectId, role: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        result: Ichat[] | [];
    }>;
    getUserMessage(chatId: string): Promise<{
        success: boolean;
        status: number;
        message: string;
        result: Imessage[] | [];
    }>;
}
//# sourceMappingURL=IchatService.d.ts.map