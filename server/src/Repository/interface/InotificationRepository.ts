import { ObjectId, Schema } from "mongoose";
import { Inotification } from "../../Model/notificationModel";
import { Ttype } from "../../Types/types";


export interface InotificationRepository{
    markAsRead(notificationId: string, userId: Schema.Types.ObjectId): unknown;
    createNotification(userId:ObjectId,title:string,message:string,userType:Ttype,url:string):Promise<Inotification|null>;
    getNotification(menteeId:ObjectId):Promise<Inotification[]|null>
}