import { ObjectId } from "mongoose";
import { IchatRepository } from "../../Repository/interface/IchatRepository";
import { IchatService } from "../interface/IchatService";
import { Status } from "../../Constants/httpStatusCode";
import { Imessage, Ichat} from "../../Model/index";
import { HttpResponse } from "../../Constants/httpResponse";
import { HttpError } from "../../Utils/index";

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
          message:  HttpResponse?.INVALID_CREDENTIALS,
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
  
      return {
        success: true,
        message: HttpResponse?.RESOURCE_FOUND,
        status: Status.Ok,
        result: result,
      };
    } catch (error: unknown) {
          throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
  //get specific User chat
  async getUserMessage(chatId: string): Promise<{success:boolean,status:number,message:string,result:Imessage[] | []}> {
    try {
      if(!chatId){
        return {
          success:false,
          status:Status.BadRequest,
          message: HttpResponse?.INVALID_CREDENTIALS,
          result:[]
        }
      }
      const result = await this._chatRespository.getUserMessage(chatId);
      if(!result){
        return {
          success:false,
          status:Status.NotFound,
          message: HttpResponse?.RESOURCE_NOT_FOUND,
          result:[]
        }
      }
    
      return{
        success:true,
          status:Status.Ok,
          message:"success",
          result:result
      }
    } catch (error:unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  } 
}
export default chatService;
