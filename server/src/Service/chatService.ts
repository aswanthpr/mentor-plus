import { ObjectId } from "mongoose";
import { IchatRepository } from "../Interface/chat/IchatRepository";
import { IchatService } from "../Interface/chat/IchatService";
import { Ichat } from "../Model/chatSchema";
import { Status } from "../Utils/httpStatusCode";

class chatService implements IchatService {
  constructor(private _chatRespository: IchatRepository) {}

  async getChats(
    userId: ObjectId,
    role:string,
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    result: Ichat[] | [];
  }> {
    try {
      if (!userId||!role) {
        return {
          success: false,
          message: "credential not found",
          status: Status.BadRequest,
          result: [],
        };
      }
      let result:Ichat[]|[]
      if(role==='mentee'){

       result = await this._chatRespository.getMenteechats(userId);
      }else{
        result = await this._chatRespository.getMentorchats(userId);
      }
      console.log(result,'thsi is the result')
      return {
        success: true,
        message: "successfully retrieved",
        status: Status.Ok,
        result: result,
      };
    } catch (error: unknown) {
      throw new Error(
        `Failed to send otp to mail1${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
export default chatService;
