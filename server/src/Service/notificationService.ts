import { ObjectId } from "mongoose";
import { Status } from "../Utils/httpStatusCode";
import { Inotification } from "../Model/notificationModel";
import { InotificationService } from "../Interface/Notification/InotificationService";
import { InotificationRepository } from "../Interface/Notification/InotificationRepository";

export class notificationService implements InotificationService{
    constructor(
        private readonly _notificationRepository:InotificationRepository,
    ){}

    async getNotification(menteeId:ObjectId): Promise<{success:boolean;message:string;status:number,result:Inotification[] | null}> {
        try {
            if(!menteeId){
                return {
                    success:false,
                    message:"credential not found",
                    status:Status.BadRequest,
                    result:null
                }
            }
            const result = await this._notificationRepository.getNotification(menteeId);
            console.log(result,'result',menteeId);
            if(!result){
                return {
                    success:false,
                    message:"Data not found",
                    status:Status.NotFound,
                    result:null
                }
            }
            return {
                success:true,
                message:"successfully data retrieved",
                status:Status.Ok,
                result:result
            }
        } catch (error:unknown) {
            throw new Error(
                `error while getting notification ${error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }

   
   async markAsReadNotification(notificationId: string, userId: ObjectId): Promise<{ success:boolean; message: string; status: number; }> {
        try {
            if(!notificationId||!userId){
                return {
                    success:false,
                    message:"credential not found",
                    status:Status.BadRequest
                }
            }
            const result =  await  this._notificationRepository.markAsRead(notificationId,userId);

            if(!result){
                return {
                    success:false,
                    message:"updation failed",
                    status:Status.NotFound
                }
            }
            return {
                success:true,
                message:"successfully updated",
                status:Status.Ok
            }
           
        } catch (error:unknown) {
            throw new Error(
                `error while marking  notification as read ${error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }
} 