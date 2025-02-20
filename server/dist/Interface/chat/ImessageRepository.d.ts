import { Imessage } from "../../Model/messageSchema";
export interface ImessageRepository {
    getMessage(): Promise<Imessage[] | []>;
}
//# sourceMappingURL=ImessageRepository.d.ts.map