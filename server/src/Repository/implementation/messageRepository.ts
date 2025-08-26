import { baseRepository } from "../baseRepo";
import { ImessageRepository } from "../interface/ImessageRepository";
import messageSchema, { Imessage } from "../../Model/messageSchema";
import { ObjectId } from "mongoose";
import { HttpError } from "../../Utils/http-error-handler.util";
import { Status } from "../../Constants/httpStatusCode";

class messageRepository
  extends baseRepository<Imessage>
  implements ImessageRepository
{
  constructor() {
    super(messageSchema);
  }
  async getMessage(chatId: ObjectId): Promise<Imessage[] | []> {
    try {
      return await this.aggregateData(messageSchema, [
        {
          $match: {
            chatId,
          },
        },
        {
          $sort: {
            createdAt: 1,
          },
        },
      ]);
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
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
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
    }
  }
}
export default new messageRepository();
