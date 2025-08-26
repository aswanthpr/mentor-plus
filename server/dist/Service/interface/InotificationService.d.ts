import { ObjectId } from "mongoose";
import { Inotification } from "../../Model/notificationModel";
export interface InotificationService {
    getNotification(mentorId: ObjectId): Promise<{
        success: boolean;
        message: string;
        status: number;
        result: Inotification[] | null;
    }>;
    markAsReadNotification(notificationId: string, userId: ObjectId): Promise<{
        success: boolean;
        message: string;
        status: number;
    }>;
}
//# sourceMappingURL=InotificationService.d.ts.map