import { ObjectId } from "mongoose";
import { Ichat } from "../../Model/chatSchema";
import { Imessage } from "src/Model/messageSchema";
export interface IchatRepository {
    getMenteechats(userId: ObjectId): Promise<Ichat[] | []>;
    getMentorchats(userId: ObjectId): Promise<Ichat[] | []>;
    createChatDocs(mentorId: ObjectId, menteeId: ObjectId): Promise<Ichat | null>;
    getUserMessage(chatId: string): Promise<Imessage[] | []>;
    findChatRoom(mentorId: ObjectId, menteeId: ObjectId): Promise<Ichat | null>;
}
//# sourceMappingURL=IchatRepository.d.ts.map