import { Ttype } from "../../Types/types";
import { InotificationRepository } from "../interface/InotificationRepository";
import  {notificationSchema, Inotification } from "../../Model/index";
import { baseRepository } from "../baseRepo";
import { ObjectId } from "mongoose";
import { HttpError } from "../../Utils/index";
import { Status } from "../../Constants/httpStatusCode";

class notificationRepository
  extends baseRepository<Inotification>
  implements InotificationRepository
{
  constructor() {
    super(notificationSchema);
  }

  async createNotification(
    userId: ObjectId,
    title: string,
    message: string,
    userType: Ttype,
    url: string
  ): Promise<Inotification | null> {
    try {
  
    
      return await this.createDocument({
        userId ,
        title,
        message,
        userType,
        url,
      });
    } catch (error) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
    }
  }

  async getNotification(menteeId: ObjectId): Promise<Inotification[] | null> {
    try {
      return await this.aggregateData(notificationSchema, [
        {
          $match: {
            userId: menteeId,
            isRead: false,
          },
        },
        {
          $sort: {
            createdAt: -1,
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
  async markAsRead(
    notificationId: string,
    userId: ObjectId
  ): Promise<Inotification | null> {
    try {
      return this.find_One_And_Update(
        notificationSchema,
        { userId, _id: notificationId },
        { $set: { isRead: true } }
      );
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
    }
  }
}
export default new notificationRepository();
