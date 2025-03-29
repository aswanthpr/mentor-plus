import { ObjectId } from "mongoose";
import { Status } from "../Constants/httpStatusCode";
import { Inotification } from "../Model/notificationModel";
import { InotificationService } from "../Interface/Notification/InotificationService";
import { InotificationRepository } from "../Interface/Notification/InotificationRepository";
import { HttpResponse } from "../Constants/httpResponse";
import { HttpError } from "../Utils/http-error-handler.util";

export class notificationService implements InotificationService {
    constructor(
        private readonly _notificationRepository: InotificationRepository,
    ) { }

    async getNotification(menteeId: ObjectId): Promise<{ success: boolean; message: string; status: number, result: Inotification[] | null }> {
        try {
            if (!menteeId) {
                return {
                    success: false,
                    message: HttpResponse?.INVALID_CREDENTIALS,
                    status: Status.BadRequest,
                    result: null
                }
            }
            const result = await this._notificationRepository.getNotification(menteeId);
console.log(result,'amdmin')
            if (!result) {
                return {
                    success: false,
                    message: HttpResponse?.RESOURCE_NOT_FOUND,
                    status: Status.NotFound,
                    result: null
                }
            }
            return {
                success: true,
                message: HttpResponse?.RESOURCE_FOUND,
                status: Status.Ok,
                result: result
            }
        } catch (error: unknown) {
            throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
        }
    }


    async markAsReadNotification(notificationId: string, userId: ObjectId): Promise<{ success: boolean; message: string; status: number; }> {
        try {
            if (!notificationId || !userId) {
                return {
                    success: false,
                    message: HttpResponse?.INVALID_CREDENTIALS,
                    status: Status.BadRequest
                }
            }
            const result = await this._notificationRepository.markAsRead(notificationId, userId);

            if (!result) {
                return {
                    success: false,
                    message: HttpResponse?.FAILED,
                    status: Status.NotFound
                }
            }
            return {
                success: true,
                message: HttpResponse?.SUCCESS,
                status: Status.Ok
            }

        } catch (error: unknown) {
            throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
        }
    }
} 