import { Stripe } from "stripe";
import { IbookingService } from "../Interface/Booking/iBookingService";
import { IslotScheduleRepository } from "../Interface/Booking/iSlotScheduleRepository";
import { ItimeSlotRepository } from "../Interface/Booking/iTimeSchedule";
import { ObjectId } from "mongoose";
import { Itimes, TurnCredentialsResponse } from "../Types";
import { IslotSchedule } from "../Model/slotSchedule";
import { Itime } from "../Model/timeModel";
import { InotificationRepository } from "../Interface/Notification/InotificationRepository";
import { IchatRepository } from "../Interface/chat/IchatRepository";
import { IwalletRepository } from "../Interface/wallet/IwalletRepository";
import { ItransactionRepository } from "../Interface/wallet/ItransactionRepository";
export declare class bookingService implements IbookingService {
    private readonly _timeSlotRepository;
    private readonly _slotScheduleRepository;
    private readonly _notificationRepository;
    private readonly _chatRepository;
    private readonly __walletRepository;
    private readonly __transactionRepository;
    private readonly stripe;
    constructor(_timeSlotRepository: ItimeSlotRepository, _slotScheduleRepository: IslotScheduleRepository, _notificationRepository: InotificationRepository, _chatRepository: IchatRepository, __walletRepository: IwalletRepository, __transactionRepository: ItransactionRepository, stripe?: Stripe);
    getTimeSlots(mentorId: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        timeSlots: Itime[] | [];
    }>;
    slotBooking(timeSlot: Itimes, messages: string, paymentMethod: string, totalAmount: string, mentorName: string, menteeId: ObjectId, protocol: string, host: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        session?: Stripe.Response<Stripe.Checkout.Session>;
    }>;
    /**
     * Stripe Webhook handler for handling checkout.session.completed event.
     * @param signature Stripe webhook signature
     * @param bodyData Stripe webhook body data
     * @returns Promise<void>
     */
    stripeWebHook(signature: string | Buffer, bodyData: Buffer): Promise<void>;
    getBookedSlots(menteeId: ObjectId, currentTab: string, search: string, sortField: string, sortOrder: string, filter: string, page: number, limit: number): Promise<{
        success: boolean;
        message: string;
        status: number;
        slots: IslotSchedule[] | [];
        totalPage: number;
    }>;
    getBookedSessions(mentorId: ObjectId, currentTab: string, search: string, sortField: string, sortOrder: string, filter: string, page: number, limit: number): Promise<{
        success: boolean;
        message: string;
        status: number;
        slots: IslotSchedule[] | [];
        totalPage: number;
    }>;
    cancelSlot(sessionId: string, reason: string, customReason: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        result: IslotSchedule | null;
    }>;
    mentorSlotCancel(sessionId: string, statusValue: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        result: IslotSchedule | null;
    }>;
    createSessionCode(bookingId: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        sessionCode: string | null;
    }>;
    sessionCompleted(bookingId: string, mentorId: ObjectId): Promise<{
        success: boolean;
        message: string;
        status: number;
        sessionStatus: string | null;
    }>;
    validateSessionJoin(sessionId: string, sessionCode: string, userId: ObjectId): Promise<{
        message: string;
        status: number;
        success: boolean;
        session_Code: string;
    }>;
    turnServerConnection(): Promise<{
        status: number;
        turnServerConfig: TurnCredentialsResponse;
    }>;
}
//# sourceMappingURL=bookingService.d.ts.map