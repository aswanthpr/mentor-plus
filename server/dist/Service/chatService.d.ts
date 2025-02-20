import { ObjectId } from "mongoose";
import { IchatRepository } from "../Interface/chat/IchatRepository";
import { IchatService } from "../Interface/chat/IchatService";
import { Ichat } from "../Model/chatSchema";
declare class chatService implements IchatService {
    private _chatRespository;
    constructor(_chatRespository: IchatRepository);
    getChats(userId: ObjectId, role: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        result: Ichat[] | [];
    }>;
}
export default chatService;
//# sourceMappingURL=chatService.d.ts.map