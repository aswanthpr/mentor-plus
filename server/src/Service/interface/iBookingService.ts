import { ObjectId } from "mongoose";
import { Itimes, TurnCredentialsResponse } from "../../Types";
import Stripe from "stripe";
import { Itime } from "../../Model/timeModel";
import { IslotSchedule } from "../../Model/slotScheduleModel";

export interface IbookingService {
  getTimeSlots(
    mentorId: string
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    timeSlots: Itime[] | [];
  }>;
  slotBooking(
    timeSlot: Itimes,
    message: string,
    paymentMethod: string,
    totalAmount: string,
    mentorName: string,
    menteeId: ObjectId,
    protocol: string,
    host: string
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    session?: Stripe.Response<Stripe.Checkout.Session>;
  }>;
  stripeWebHook(signature: string | Buffer, bodyData: Buffer): Promise<void>;
  getBookedSlots(
    menteeId: ObjectId,
    currentTab: string,
    search: string,
    sortField: string,
    sortOrder: string,
    filter: string,
    page: number,
    limit: number
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    slots: IslotSchedule[] | [];
    totalPage: number;
  }>;
  getBookedSessions(
    mentorId: ObjectId,
    currentTab: string,
    search: string,
    sortField: string,
    sortOrder: string,
    filter: string,
    page: number,
    limit: number
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    slots: IslotSchedule[] | [];
    totalPage:number
  }>;
  cancelSlot(
    sessionId: string,
    reason: string,
    customReason: string
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    result: IslotSchedule | null;
  }>;

  mentorSlotCancel(
    sessionId: string,
    statusValue: string
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    result: IslotSchedule | null;
  }>;
  createSessionCode(
    bookingId: string
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    sessionCode: string | null;
  }>;
  sessionCompleted(
    bookingId: string,
    mentorId: ObjectId
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    sessionStatus: string | null;
  }>;
  validateSessionJoin(
    sessionId: string,
    sessionCode: string,
    userId:ObjectId,
  ): Promise<{
    message: string;
    status: number;
    success: boolean;
    session_Code: string;
  }>;
   turnServerConnection(
  ): Promise<{
   
    status: number;
    turnServerConfig: TurnCredentialsResponse;
  }>;
}
