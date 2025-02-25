import { ObjectId } from "mongoose";
import { IchatRepository } from "../Interface/chat/IchatRepository";
import { IchatService } from "../Interface/chat/IchatService";
import { Ichat } from "../Model/chatSchema";
import { Imessage } from "src/Model/messageSchema";
declare class chatService implements IchatService {
    private _chatRespository;
    constructor(_chatRespository: IchatRepository);
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
export default chatService;
//# sourceMappingURL=chatService.d.ts.map