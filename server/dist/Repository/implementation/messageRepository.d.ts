import { baseRepository } from "../baseRepo";
import { ImessageRepository } from "../interface/ImessageRepository";
import { Imessage } from "../../Model/messageSchema";
import { ObjectId } from "mongoose";
declare class messageRepository extends baseRepository<Imessage> implements ImessageRepository {
    constructor();
    getMessage(chatId: ObjectId): Promise<Imessage[] | []>;
    createMessage(data: Imessage): Promise<Imessage | null>;
}
declare const _default: messageRepository;
export default _default;
//# sourceMappingURL=messageRepository.d.ts.map