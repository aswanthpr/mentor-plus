
import { baseRepository } from "./baseRepo";
import chatSchema, { Ichat } from "../Model/chatSchema";
import { IchatRepository } from "../Interface/chat/IchatRepository";
import {  ObjectId } from "mongoose";


class chatRepository
  extends baseRepository<Ichat>
  implements IchatRepository
{
  constructor() {
    super(chatSchema);
  }
async getMenteechats(userId: ObjectId): Promise<Ichat[] | []> {
        try {

           return await this.aggregateData(chatSchema,
                [
                    {
                        $match:{
                            menteeId:userId,

                        },
                    },
                    {
                        $lookup:{
                            from:'mentors',
                            localField:"mentorId",
                            foreignField:"_id",
                            as:"users"
                        }
                    },
                    {
                        $unwind:"$users",
    
                    }
                ]
            )
    
          } catch (error: unknown) {
            throw new Error(
              `${"\x1b[35m%s\x1b[0m"}error while mentor chats:${
                error instanceof Error ? error.message : String(error)
              }`
            );
          }
    }

async getMentorchats(userId: ObjectId): Promise<Ichat[] | []> {
    try {

       return  await this.aggregateData(chatSchema,
            [
                {
                    $match:{
                        mentorId:userId,

                    }
                },
                {
                    $lookup:{
                        from:'mentees',
                        localField:"menteeId",
                        foreignField:"_id",
                        as:"users"
                    }
                },
                {
                    $unwind:"$users",

                }

            ]
        )
      } catch (error: unknown) {
        throw new Error(
          `${"\x1b[35m%s\x1b[0m"}error while creating mentor chats :${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
}
}
export default new chatRepository();