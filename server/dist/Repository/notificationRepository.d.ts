import { Ttype } from "../Types/types";
import { InotificationRepository } from "../Interface/Notification/InotificationRepository";
import { Inotification } from "../Model/notificationModel";
import { baseRepository } from "./baseRepo";
import { ObjectId } from "mongoose";
declare class notificationRepository extends baseRepository<Inotification> implements InotificationRepository {
    constructor();
    createNotification(userId: ObjectId, title: string, message: string, userType: Ttype, url: string): Promise<Inotification | null>;
    getNotification(menteeId: ObjectId): Promise<Inotification[] | null>;
    markAsRead(notificationId: string, userId: ObjectId): Promise<Inotification | null>;
}
declare const _default: notificationRepository;
export default _default;
//# sourceMappingURL=notificationRepository.d.ts.map