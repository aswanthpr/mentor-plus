import { baseRepository } from "./baseRepo";
import chatSchema, { Ichat } from "../Model/chatSchema";
import { IchatRepository } from "../Interface/chat/IchatRepository";
import { ObjectId } from "mongoose";
import messageSchema, { Imessage } from "../Model/messageSchema";
import { HttpError } from "../Utils/http-error-handler.util";
import { Status } from "../Constants/httpStatusCode";
class chatRepository extends baseRepository<Ichat> implements IchatRepository {
  constructor() {
    super(chatSchema);
  }
  async getMenteechats(userId: ObjectId): Promise<Ichat[] | []> {
    try {
      return await this.aggregateData(chatSchema, [
        {
          $match: {
            menteeId: userId,
          },
        },
        
        {
          $lookup: {
            from: "mentors",
            localField: "mentorId",
            foreignField: "_id",
            as: "users",
          },
        },
        {
          $unwind: "$users",
        },
        
        {
          $project: {
            _id: 1,
            mentorId: 1,
            menteeId: 1,
            lastMessage: 1,
            createdAt: 1,
            updatedAt:1,
            users: {
              _id: 1,
              name: 1,
              email: 1,
              phone: 1,
              githubUrl: 1,
              linkedinUrl: 1,
              profileUrl: 1,
            },
          },
        },
        {
          $sort:{updatedAt:-1}
        },
      ]);
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }

  async getMentorchats(userId: ObjectId): Promise<Ichat[] | []> {
    try {
      return await this.aggregateData(chatSchema, [
        {
          $match: {
            mentorId: userId,
          },
        },
        {
          $lookup: {
            from: "mentees",
            localField: "menteeId",
            foreignField: "_id",
            as: "users",
          },
        },
        {
          $unwind: "$users",
        },
        {
          $project: {
            _id: 1,
            mentorId: 1,
            menteeId: 1,
            lastMessage: 1,
            createdAt: 1,
            updatedAt:1,
            users: {
              _id: 1,
              name: 1,
              email: 1,
              phone: 1,
              githubUrl: 1,
              linkedinUrl: 1,
              profileUrl: 1,
            },
          },
        },
      ]);
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
  //creating chat document
  async createChatDocs(
    mentorId: ObjectId,
    menteeId: ObjectId
  ): Promise<Ichat | null> {
    try {
      return this.createDocument({ menteeId, mentorId });
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }

  //get users data
  async getUserMessage(chatId: string):Promise<Imessage[] | []> {
    try {
      return this.aggregateData(messageSchema, [
        {
          $match: {
            chatId,
          },
        },
        {
          $lookup:{
            from:"chats",
            localField:"chatId",
            foreignField:"_id",
            as:"chats"
          }
        },
        {
          $unwind:{
            path:'$chats',
            preserveNullAndEmptyArrays:true
          }
        }
      ]);
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }

  async findChatRoom(mentorId:ObjectId,menteeId:ObjectId):Promise<Ichat|null>{
    try {

      return await this.find_One({menteeId,mentorId});
   
    } catch (error:unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
}
export default new chatRepository();
