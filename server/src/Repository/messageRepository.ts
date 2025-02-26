import { baseRepository } from "./baseRepo";
import { ImessageRepository } from "../Interface/chat/ImessageRepository";
import messageSchema, { Imessage } from "../Model/messageSchema";
import { ObjectId } from "mongoose";

class messageRepository
  extends baseRepository<Imessage>
  implements ImessageRepository
{
  constructor() {
    super(messageSchema);
  }
  async getMessage(chatId: ObjectId): Promise<Imessage[] | []> {
    try {
      console.log(chatId,'thsi si chatid')

      const data =  await this.aggregateData(messageSchema, [
        {
          $match: {
            chatId,
          },
        },
        {
          $sort: {
            createdAt:1,
          },
        },
      ]);
      console.log(data,'thsi is message');
      return data;
    } catch (error: unknown) {
      throw new Error(
        `${"\x1b[35m%s\x1b[0m"}error while creating tiem slot :${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async createMessage(data: Imessage): Promise<Imessage | null> {
    try {

      return this.createDocument({
        chatId: data?.chatId,
        senderId: data?.senderId,
        receiverId: data?.receiverId,
        senderType: data?.senderType,
        content: data?.content,
        messageType: data?.messageType,
      });
    } catch (error: unknown) {
      throw new Error(
        `${"\x1b[35m%s\x1b[0m"}error while creating message slot :${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
export default new messageRepository();
