import { baseRepository } from "./baseRepo";
import { Ichat } from "../Model/chatSchema";
import { IchatRepository } from "../Interface/chat/IchatRepository";
import { ObjectId } from "mongoose";
declare class chatRepository extends baseRepository<Ichat> implements IchatRepository {
    constructor();
    getMenteechats(userId: ObjectId): Promise<Ichat[] | []>;
    getMentorchats(userId: ObjectId): Promise<Ichat[] | []>;
}
declare const _default: chatRepository;
export default _default;
//# sourceMappingURL=chatRepository.d.ts.map