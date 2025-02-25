import { ObjectId } from "mongoose";
import { IchatRepository } from "../Interface/chat/IchatRepository";
import { IchatService } from "../Interface/chat/IchatService";
import { Ichat } from "../Model/chatSchema";
import { Status } from "../Utils/httpStatusCode";
import { Imessage } from "src/Model/messageSchema";

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
      console.log('userId',userId)
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
  //get specific User chat
  async getUserMessage(chatId: string): Promise<{success:boolean,status:number,message:string,result:Imessage[] | []}> {
    try {
      if(!chatId){
        return {
          success:false,
          status:Status.BadRequest,
          message:"credential not found",
          result:[]
        }
      }
      const result = await this._chatRespository.getUserMessage(chatId);
      if(!result){
        return {
          success:false,
          status:Status.NotFound,
          message:"no result",
          result:[]
        }
      }
      console.log(result,'result messages')
      return{
        success:true,
          status:Status.Ok,
          message:"success",
          result:result
      }
    } catch (error:unknown) {
      throw new Error(
        `error while get all user message in service${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  } 
}
export default chatService;
