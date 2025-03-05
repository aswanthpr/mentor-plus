import { Stripe } from "stripe";
import { IbookingService } from "../Interface/Booking/iBookingService";
import { IslotScheduleRepository } from "../Interface/Booking/iSlotScheduleRepository";
import { ItimeSlotRepository } from "../Interface/Booking/iTimeSchedule";
import mongoose, { ObjectId } from "mongoose";
import { InewSlotSchedule, Itimes } from "../Types";
import { IslotSchedule } from "../Model/slotSchedule";
import { Status } from "../Utils/httpStatusCode";
import { Itime } from "../Model/timeModel";
import { InotificationRepository } from "../Interface/Notification/InotificationRepository";
import moment from "moment";
import { socketManager } from "../index";
import { Inotification } from "../Model/notificationModel";
import { IchatRepository } from "../Interface/chat/IchatRepository";
import { generateSessionCode } from "../Utils/reusable.util";

export class bookingService implements IbookingService {
  constructor(
    private readonly _timeSlotRepository: ItimeSlotRepository,
    private readonly _slotScheduleRepository: IslotScheduleRepository,
    private readonly _notificationRepository: InotificationRepository,
    private readonly _chatRepository: IchatRepository,
    private readonly stripe: Stripe = new Stripe(
      process.env.STRIPE_SECRET_KEY as string,
      {
        apiVersion:"2025-02-24.acacia",
        maxNetworkRetries: 4,
      }
    )
  ) {}

  async getTimeSlots(mentorId: string): Promise<{
    success: boolean;
    message: string;
    status: number;
    timeSlots: Itime[] | [];
    platformFee: string | undefined;
  }> {
    try {
      if (!mentorId) {
        return {
          status: Status.BadRequest,
          message: "credential not found",
          success: false,
          timeSlots: [],
          platformFee: undefined,
        };
      }
      const response = await this._timeSlotRepository.getMentorSlots(mentorId);
      if (!response) {
        return {
          status: Status.Ok,
          message: "Data not found",
          success: false,
          timeSlots: [],
          platformFee: undefined,
        };
      }
      console.log(response, "from service");
      return {
        status: Status.Ok,
        message: "Data fetched successfully",
        success: true,
        timeSlots: response,
        platformFee: process.env?.PLATFORM_FEE,
      };
    } catch (error: unknown) {
      throw new Error(
        `${
          error instanceof Error ? error.message : String(error)
        } error while gettign Time Slots in mentee service`
      );
    }
  }

  //place slot booking
  async slotBooking(
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
  }> {
    try {
      console.log(timeSlot, message, paymentMethod, totalAmount);

      if (!timeSlot || !message || !paymentMethod || !totalAmount) {
        return {
          status: Status.BadRequest,
          message: "credential not found",
          success: false,
        };
      }
      if (paymentMethod == "stripe") {
        const startStr = moment(timeSlot["startTime"]).format(`hh:mm A`);
        const endStr = moment(timeSlot["endTime"]).format(`hh:mm A`);

        const session = await this.stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          client_reference_id: String(menteeId),
          line_items: [
            {
              price_data: {
                currency: "usd",
                unit_amount: parseInt(totalAmount) * 100,
                product_data: {
                  name: `Your mentor is  ${mentorName.toLocaleUpperCase()}`,
                  description: `YOUR SLOT DATE IS :${
                    String(timeSlot?.startDate).split("T")[0]
                  }
                TIME IS IN BETWEEN ${startStr}-${endStr}`,
                },
              },
              quantity: 1,
            },
          ],
          success_url: `${process.env?.CLIENT_ORIGIN_URL}/mentee/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${protocol}://${host}/mentee/stripe-cancel`,
          metadata: {
            timeSlot: JSON.stringify(timeSlot),
            message,
            paymentMethod,
            menteeId: String(menteeId),
          },
        });

        return {
          success: true,
          message: "successfully send the respne",
          status: Status.Ok,
          session,
        };
      }
      return {
        success: false,
        message: "error while payment",
        status: Status.NotFound,
      };
    } catch (error: unknown) {
      throw new Error(
        `${
          error instanceof Error ? error.message : String(error)
        } error while place Slot booking in mentee service`
      );
    }
  }

  /**
   * Stripe Webhook handler for handling checkout.session.completed event.
   * @param signature Stripe webhook signature
   * @param bodyData Stripe webhook body data
   * @returns Promise<void>
   */

  async stripeWebHook(
    signature: string | Buffer,
    bodyData: Buffer
  ): Promise<void> {
    try {
      if (!signature || !bodyData) {
        throw new Error("Missing signature or body data in webhook request.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let event: any;

      try {
        event = this.stripe.webhooks.constructEvent(
          bodyData,
          signature as string | Buffer,
          process.env.STRIPE_WEBHOOK_SECRET as string
        );
      } catch (err: unknown) {
        console.error(
          "⚠️ Webhook signature verification failed.",
          err instanceof Error ? err.message : String(err)
        );
        return;
      }

      console.log("🔔 Received webhook event:", event.type);

      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          const metadata = session.metadata || {};

          if (!session.metadata) {
            console.error("Missing metadata in Stripe session");
            return;
          }

          const { timeSlot, message, paymentMethod, menteeId } = metadata;

          if (!timeSlot || !message || !paymentMethod || !menteeId) {
            console.error("Invalid or missing metadata in Stripe webhook");
            return;
          }

          if (!mongoose.Types.ObjectId.isValid(menteeId)) {
            console.error("Invalid menteeId format:", menteeId);
            return;
          }
          const menteeObjectId = new mongoose.Types.ObjectId(
            menteeId
          ) as unknown as mongoose.Schema.Types.ObjectId;
          const slotId = new mongoose.Types.ObjectId(
            JSON.parse(timeSlot)._id as string
          ) as unknown as mongoose.Schema.Types.ObjectId;
          const status = session.payment_status == "paid" ? "Paid" : "Failed";

          const totalAmount = (session.amount_total || 0) / 100;
          const time = new Date(session.created * 1000).toLocaleString();

          // Insert data into newSlotSchedule
          const newSlotSchedule: InewSlotSchedule = {
            menteeId: menteeObjectId,
            slotId,
            paymentStatus: status,
            paymentTime: time,
            paymentMethod: "stripe",
            paymentAmount: String(totalAmount),
            duration: JSON.parse(timeSlot)?.duration,
            description: message,
            status: "CONFIRMED",
          };
          console.log(newSlotSchedule, "Updated newSlotSchedule Object");
          const response = await this._slotScheduleRepository.newSlotBooking(
            newSlotSchedule as IslotSchedule
          );
          if (!response) {
            return;
          }
          const mentorId = response.times?.mentorId as ObjectId;
          const mentorID = String(mentorId);

          await this._timeSlotRepository.makeTimeSlotBooked(String(slotId));
          //notification for mentee
          const notific = await this._notificationRepository.createNotification(
            menteeObjectId as unknown as ObjectId,
            `Slot booked successfully`,
            `Congratulations! You've been successfully booked your slot.`,
            `mentee`,
            `${process.env.CLIENT_ORIGIN_URL}/mentee/bookings`
          );
          if (menteeId && notific) {
            socketManager.sendNotification(menteeId as string, notific);
          }

          if (mentorId) {
            //notification for mentor
            const notif = await this._notificationRepository.createNotification(
              mentorId as mongoose.Schema.Types.ObjectId,
              `Your new slot were Scheduled`,
              `new slot were scheduled . checkout now`,
              `mentor`,
              `${process.env.CLIENT_ORIGIN_URL}/mentor/session`
            );
            socketManager.sendNotification(
              mentorID as string,
              notif as Inotification
            );
          }
          //creating chat document
          const resp = await this._chatRepository.findChatRoom(mentorId,menteeObjectId);
          if(!resp){

            await this._chatRepository.createChatDocs(mentorId, menteeObjectId);
          }
          if (response) {
            return;
          } else {
            throw new Error("Failed to create appointment");
          }
        }

        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (error: unknown) {
      throw new Error(
        `${
          error instanceof Error ? error.message : String(error)
        } error while webhook handling in mentee service`
      );
    }
  }

  //fetch mentee booked slots

  /**
   * Fetches the booked slots for a given mentee.
   *
   * @param menteeId - The ObjectId of the mentee.
   *
   * @returns A promise resolving to an object containing success status, message, HTTP status number, and an array of booked slots.
   *
   * @throws Error - Throws an error if there is an issue while fetching the booked slots.
   */
  async getBookedSlots(
    menteeId: ObjectId,
    currentTab: string
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    slots: IslotSchedule[] | [];
  }> {
    try {
      console.log(currentTab, menteeId, "098765432");
      if (
        !menteeId ||
        !currentTab ||
        !mongoose.Types.ObjectId.isValid(String(menteeId))
      ) {
        return {
          success: false,
          message: "credential not found",
          status: Status.NotFound,
          slots: [],
        };
      }
      const tabCond = currentTab == "upcoming" ? false : true;
      console.log(tabCond, currentTab, "this si tab");

      const response = await this._slotScheduleRepository.getBookedSlot(
        menteeId,
        tabCond
      );
      if (!response || response.length === 0) {
        return {
          success: false,
          message: "No slots found",
          status: Status.Ok,
          slots: [],
        };
      }

      return {
        success: true,
        message: "slots found",
        status: Status.Ok,
        slots: response,
      };
    } catch (error: unknown) {
      throw new Error(
        `${
          error instanceof Error ? error.message : String(error)
        } error while webhook handling in mentee service`
      );
    }
  }

  async getBookedSessions(
    mentorId: ObjectId,
    currentTab: string
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    slots: IslotSchedule[] | [];
  }> {
    try {
      console.log(currentTab, mentorId, "098765432");
      if (
        !mentorId ||
        !currentTab ||
        !mongoose.Types.ObjectId.isValid(String(mentorId))
      ) {
        return {
          success: false,
          message: "credential not found",
          status: Status.NotFound,
          slots: [],
        };
      }
      const tabCond = currentTab == "upcoming" ? false : true;


      const response = await this._slotScheduleRepository.getBookedSession(
        mentorId,
        tabCond
      );
      if (!response || response.length === 0) {
        return {
          success: false,
          message: "No slots found",
          status: Status.Ok,
          slots: [],
        };
      }

      return {
        success: true,
        message: "slots retrieved",
        status: Status.Ok,
        slots: response,
      };
    } catch (error: unknown) {
      throw new Error(
        `${
          error instanceof Error ? error.message : String(error)
        } error while webhook handling in mentee service`
      );
    }
  }
  async cancelSlot(
    sessionId: string,
    reason: string,
    customReason: string
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    result: IslotSchedule | null;
  }> {
    try {
      if (!sessionId || !reason || (reason == "other" && customReason == "")) {
        return {
          success: false,
          message: "credential not found",
          status: Status.BadRequest,
          result: null,
        };
      }
      let issue: string | undefined = undefined;
      if (reason !== "other") {
        issue = reason;
      } else {
        issue = customReason;
      }

      const response = await this._slotScheduleRepository.cancelSlot(
        sessionId,
        issue
      );
      if (!response) {
        return {
          success: false,
          message: "something went wrong",
          status: Status.NotFound,
          result: null,
        };
      }
      return {
        success: true,
        message: "cancel requested successfully",
        status: Status.Ok,
        result: response,
      };
    } catch (error: unknown) {
      throw new Error(
        `${
          error instanceof Error ? error.message : String(error)
        } error while slot cancel in  service`
      );
    }
  }
  //mentor handle cancel slot req
  async mentorSlotCancel(
    sessionId: string,
    statusValue: string
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    result: IslotSchedule | null;
  }> {
    try {
      if (!sessionId || !statusValue) {
        return {
          success: false,
          message: "credential not found",
          status: Status.BadRequest,
          result: null,
        };
      }

      const response = await this._slotScheduleRepository.mentorSlotCancel(
        sessionId,
        statusValue
      );
      if (!response) {
        return {
          success: false,
          message: "result not found ",
          status: Status.NotFound,
          result: null,
        };
      }
      return {
        success: true,
        message: "cancel requested successfully",
        status: Status.Ok,
        result: response,
      };
    } catch (error: unknown) {
      throw new Error(
        `${
          error instanceof Error ? error.message : String(error)
        } error while metnor slot cancel  handle in  service`
      );
    }
  }
  //create session code 
  async createSessionCode(bookingId: string): Promise<{ success: boolean; message: string; status: number; sessionCode: string|null; }> {
    try {
      if (!bookingId ) {
        return {
          success: false,
          message: "credential not found",
          status: Status.BadRequest,
          sessionCode:null,
        };
      }
      //generate sessionCode
      const session_Code = generateSessionCode();

      console.log(session_Code,'sessionCode')
      const response = await this._slotScheduleRepository.createSessionCode(
        bookingId,session_Code
        
      );
      
      if (!response) {
        return {
          success: false,
          message: "result not found ",
          status: Status.NotFound,
          sessionCode: null,
        };
      }
      console.log('response')
      return {
        success: true,
        message: "session Code  created successfully",
        status: Status.Ok,
        sessionCode: response,
      };
    } catch (error: unknown) {
      throw new Error(
        `${
          error instanceof Error ? error.message : String(error)
        } error while metnor create session code  in  service`
      );
    }
  };
  //session completed marking 
  async sessionCompleted(bookingId: string): Promise<{ success: boolean; message: string; status: number; sessionStatus: string|null; }> {
    try {
      if (!bookingId ) {
        return {
          success: false,
          message: "credential not found",
          status: Status.BadRequest,
          sessionStatus:null,
        };
      }

      const response = await this._slotScheduleRepository.sessionCompleted(
        bookingId
        
      );
      if (!response) {
        return {
          success: false,
          message: "result not found ",
          status: Status.NotFound,
          sessionStatus:null,

        };
      }
      return {
        success: true,
        message: "marked as completed!",
        status: Status.Ok,
        sessionStatus:response?.status,
      };
    } catch (error:unknown) {
      throw new Error(
        `${
          error instanceof Error ? error.message : String(error)
        } error while chnage the session status as completed  in  service`
      );
    }
  }
}
