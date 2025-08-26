import { ObjectId } from "mongoose";
import { Inotification } from "../../Model/notificationModel";
import { InotificationService } from "../interface/InotificationService";
import { InotificationRepository } from "../../Repository/interface/InotificationRepository";
export declare class notificationService implements InotificationService {
    private readonly _notificationRepository;
    constructor(_notificationRepository: InotificationRepository);
    getNotification(menteeId: ObjectId): Promise<{
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
//# sourceMappingURL=notificationService.d.ts.map