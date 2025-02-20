
import { Ttype } from "../Types/types";
import { InotificationRepository } from "../Interface/Notification/InotificationRepository";
import notificationModel, { Inotification } from "../Model/notificationModel";
import { baseRepository } from "./baseRepo";
import { ObjectId } from "mongoose";

class notificationRepository  extends baseRepository<Inotification> implements InotificationRepository{
constructor(){
    super(notificationModel)
}

async createNotification(userId: ObjectId, title: string, message: string, userType: Ttype,url:string): Promise<Inotification | null> {
    return await this.createDocument({
        userId,
        title,
        message,
        userType,
        url
    })
}

async getNotification(menteeId: ObjectId): Promise<Inotification[] | null> {
    try {
        return await this.aggregateData(notificationModel,
            [
                {
                    $match:{
                        userId:menteeId,
                        isRead:false
                    }
                },
                {
                    $sort:{
                        createdAt:-1
                    }
                }
            ]
        );
    } catch (error:unknown) {
        throw new Error(
            `error while getting notification  ${error instanceof Error ? error.message : String(error)
            }`
          );
    }
}
async markAsRead(notificationId:string,userId:ObjectId):Promise<Inotification|null>{
    try {
        return this.find_One_And_Update(notificationModel,{userId,_id:notificationId},{$set:{isRead:true}});
    } catch (error:unknown) {
        throw new Error(
            `error while markas  notification  read ${error instanceof Error ? error.message : String(error)
            }`
          );
    }
}
}
export default new notificationRepository();