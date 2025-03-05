import { baseRepository } from "./baseRepo";
import { Ichat } from "../Model/chatSchema";
import { IchatRepository } from "../Interface/chat/IchatRepository";
import { ObjectId } from "mongoose";
import { Imessage } from "../Model/messageSchema";
declare class chatRepository extends baseRepository<Ichat> implements IchatRepository {
    constructor();
    getMenteechats(userId: ObjectId): Promise<Ichat[] | []>;
    getMentorchats(userId: ObjectId): Promise<Ichat[] | []>;
    createChatDocs(mentorId: ObjectId, menteeId: ObjectId): Promise<Ichat | null>;
    getUserMessage(chatId: string): Promise<Imessage[] | []>;
    findChatRoom(mentorId: ObjectId, menteeId: ObjectId): Promise<Ichat | null>;
}
declare const _default: chatRepository;
export default _default;
//# sourceMappingURL=chatRepository.d.ts.map