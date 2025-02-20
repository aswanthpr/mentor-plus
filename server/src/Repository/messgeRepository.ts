
import { baseRepository } from "./baseRepo";
import { ImessageRepository } from "../Interface/chat/ImessageRepository";
import messageSchema, { Imessage } from "../Model/messageSchema";

class messageRepository
  extends baseRepository<Imessage>
  implements ImessageRepository
{
  constructor() {
    super(messageSchema);
  }
  async getMessage(): Promise<Imessage[]|[]> {
    try {
      return await messageSchema.find()
    } catch (error: unknown) {
      throw new Error(
        `${"\x1b[35m%s\x1b[0m"}error while creating tiem slot :${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }


}
export default new messageRepository();
