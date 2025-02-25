import { baseRepository } from "./baseRepo";
import { ImessageRepository } from "../Interface/chat/ImessageRepository";
import { Imessage } from "../Model/messageSchema";
declare class messageRepository extends baseRepository<Imessage> implements ImessageRepository {
    constructor();
    getMessage(): Promise<Imessage[] | []>;
    createMessage(data: Partial<Imessage>): Promise<Imessage | null>;
}
declare const _default: messageRepository;
export default _default;
//# sourceMappingURL=messageRepository.d.ts.map