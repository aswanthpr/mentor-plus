import { Ttype } from "../Types/types";
import { InotificationRepository } from "../Interface/Notification/InotificationRepository";
import notificationModel, { Inotification } from "../Model/notificationModel";
import { baseRepository } from "./baseRepo";
import { ObjectId } from "mongoose";
import { HttpError } from "../Utils/http-error-handler.util";
import { Status } from "../Constants/httpStatusCode";

class notificationRepository
  extends baseRepository<Inotification>
  implements InotificationRepository
{
  constructor() {
    super(notificationModel);
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
        userId,
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
      return await this.aggregateData(notificationModel, [
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
        notificationModel,
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
