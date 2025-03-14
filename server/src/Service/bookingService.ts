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
import { Iwallet } from "../Model/walletModel";
import { IwalletRepository } from "../Interface/wallet/IwalletRepository";
import { ItransactionRepository } from "../Interface/wallet/ItransactionRepository";

export class bookingService implements IbookingService {
  constructor(
    private readonly _timeSlotRepository: ItimeSlotRepository,
    private readonly _slotScheduleRepository: IslotScheduleRepository,
    private readonly _notificationRepository: InotificationRepository,
    private readonly _chatRepository: IchatRepository,
    private readonly __walletRepository: IwalletRepository,
    private readonly __transactionRepository: ItransactionRepository,
    private readonly stripe: Stripe = new Stripe(
      process.env.STRIPE_SECRET_KEY as string,
      {
        apiVersion: "2025-02-24.acacia",
        maxNetworkRetries: 4,
      }
    )
  ) {}

  async getTimeSlots(mentorId: string): Promise<{
    success: boolean;
    message: string;
    status: number;
    timeSlots: Itime[] | [];
  }> {
    try {
      if (!mentorId) {
        return {
          status: Status.BadRequest,
          message: "credential not found",
          success: false,
          timeSlots: [],
        };
      }
      const response = await this._timeSlotRepository.getMentorSlots(mentorId);
      if (!response) {
        return {
          status: Status.Ok,
          message: "Data not found",
          success: false,
          timeSlots: [],
        };
      }
      console.log(response, "from service");
      return {
        status: Status.Ok,
        message: "Data fetched successfully",
        success: true,
        timeSlots: response,
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
    messages: string,
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
      console.log(timeSlot, messages, paymentMethod, totalAmount);

      if (!timeSlot || !messages || !paymentMethod || !totalAmount) {
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
                  name: `Mentor is ${decodeURIComponent(
                    mentorName.toLocaleUpperCase()
                  )}`,
                  description: `Slot date is: ${
                    String(timeSlot?.startDate).split("T")[0]
                  }
                time is ${startStr}-${endStr}`,
                },
              },
              quantity: 1,
            },
          ],
          success_url: `${process.env?.CLIENT_ORIGIN_URL}/mentee/stripe-success?session_id={CHECKOUT_SESSION_ID}&success=true`,
          cancel_url: `${protocol}://${host}/mentee/stripe-cancel?cancelled=true`,
          metadata: {
            timeSlot: JSON.stringify(timeSlot),
            messages,
            paymentMethod,
            menteeId: String(menteeId),
          },
        });

        return {
          success: true,
          message: "stripe payment initiated successfully",
          status: Status.Ok,
          session,
        };
      } else if (paymentMethod == "wallet") {
        const deductAmountFromWallet =
          await this.__walletRepository.deductAmountFromWallet(
            Number(totalAmount),
            menteeId
          );

        if (!deductAmountFromWallet) {
          return {
            message: "Insufficient balance in wallet",
            status: Status?.BadRequest,
            success: false,
          };
        }

        const time = new Date().toLocaleString();
        console.log(time, "times ");

        //create  new transaction
        const newTranasaction = {
          amount: Number(totalAmount),
          walletId: deductAmountFromWallet?._id as ObjectId,
          transactionType: "debit",
          status: "completed",
          note: "slot booked ",
        };

        await this.__transactionRepository.createTransaction(newTranasaction);

        // Insert data into newSlotSchedule
        const newSlotSchedule: InewSlotSchedule = {
          menteeId,
          slotId: timeSlot?._id,
          paymentStatus: "Paid",
          paymentTime: time,
          paymentMethod: "wallet",
          paymentAmount: String(totalAmount),
          duration: String(timeSlot?.duration),
          description: messages,
          status: "CONFIRMED",
        };

        const response = await this._slotScheduleRepository.newSlotBooking(
          newSlotSchedule as IslotSchedule
        );

        const mentorId = response?.times?.mentorId as ObjectId;

        await this._timeSlotRepository.makeTimeSlotBooked(
          String(timeSlot?._id)
        );

        //notification for mentee
        const notific = await this._notificationRepository.createNotification(
          menteeId as ObjectId,
          `Slot booked successfully`,
          `Congratulations! You've been successfully booked your slot.`,
          `mentee`,
          `${process.env.CLIENT_ORIGIN_URL}/mentee/bookings`
        );

        if (menteeId && notific) {
          socketManager.sendNotification(String(menteeId), notific);
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
          //make it realtime using socket
          socketManager.sendNotification(
            String(mentorId),
            notif as Inotification
          );
        }
        //creating chat document
        const resp = await this._chatRepository.findChatRoom(
          mentorId,
          menteeId
        );
        if (!resp) {
          await this._chatRepository.createChatDocs(mentorId, menteeId);
        }
        return {
          message: "slot booked successfully",
          status: Status?.Ok,
          success: true,
        };
      }

      return {
        success: false,
        message: "error while payment",
        status: Status.BadRequest,
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

          //if the data not exist send notification to mentee
          if (
            !metadata ||
            !metadata.menteeId ||
            !metadata.timeSlot ||
            !metadata.messages ||
            !metadata.paymentMethod
          ) {
            console.log(
              metadata,
              metadata.menteeId,
              metadata.timeSlot,
              metadata.message,
              metadata.paymentMethod
            );
            console.error("❌ Invalid or missing metadata in Stripe webhook");

            // Redirect to error page when metadata is missing
            const noti = await this._notificationRepository.createNotification(
              metadata.menteeId as unknown as ObjectId,
              `Payment Failed`,
              `Your payment could not be processed. Please try again.`,
              `mentee`,
              ""
            );
            if (metadata?.menteeId && noti) {
              socketManager.sendNotification(
                metadata?.menteeId as string,
                noti
              );
            }
            return;
          }

          const { timeSlot, messages, menteeId } = metadata;

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

          if (status === "Failed") {
            console.error("❌ Payment failed. Redirecting to error page.");

            const notification =
              await this._notificationRepository.createNotification(
                menteeObjectId,
                `Payment Failed`,
                `Your payment could not be processed. Please try again.`,
                `mentee`,
                ""
              );
            if (menteeId && notification) {
              socketManager.sendNotification(menteeId as string, notification);
            }
            return;
          }
          const totalAmount = (session.amount_total || 0) / 100;
          const time = new Date(session.created * 1000).toISOString();

          //checking wallet exist or not
          const walletResponse = (await this.__walletRepository.findWallet(
            menteeObjectId
          )) as Iwallet;

          let newWallet: Iwallet | null = null;
          // if wallet not exist create new one
          if (!walletResponse) {
            newWallet = await this.__walletRepository.createWallet({
              userId: menteeObjectId,
              balance: 0,
            } as Iwallet);
          }
          //create  new transaction
          const newTranasaction = {
            amount: totalAmount,
            walletId: (walletResponse
              ? walletResponse?.["_id"]
              : newWallet!._id) as ObjectId,
            transactionType: "paid",
            status: "completed",
            note: "slot booked successfully",
          };

          await this.__transactionRepository.createTransaction(newTranasaction);

          // Insert data into newSlotSchedule
          const newSlotSchedule: InewSlotSchedule = {
            menteeId: menteeObjectId,
            slotId,
            paymentStatus: status,
            paymentTime: time,
            paymentMethod: "stripe",
            paymentAmount: String(totalAmount),
            duration: JSON.parse(timeSlot)?.duration,
            description: messages,
            status: "CONFIRMED",
          };

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
            //make it realtime using socket
            socketManager.sendNotification(
              mentorID as string,
              notif as Inotification
            );
          }
          //creating chat document
          const resp = await this._chatRepository.findChatRoom(
            mentorId,
            menteeObjectId
          );
          if (!resp) {
            await this._chatRepository.createChatDocs(mentorId, menteeObjectId);
          }
          return;
        }
        case "checkout.session.expired":
        case "checkout.session.failed": {
          const session = event.data.object as Stripe.Checkout.Session;
          console.error("❌ Payment Failed or Expired:", session.id);

          if (session.metadata && session.metadata.menteeId) {
            await this._notificationRepository.createNotification(
              session.metadata.menteeId as unknown as ObjectId,
              `Payment Failed`,
              `Your payment attempt failed. Please try again.`,
              `mentee`,
              ""
            );
          }
          return;
        }
        case "payment_intent.payment_failed": {
          const session = event.data.object as Stripe.Checkout.Session;
          console.error("❌ Payment Failed:", session.id);

          if (session.metadata && session.metadata.menteeId) {
            const notific =
              await this._notificationRepository.createNotification(
                session.metadata.menteeId as unknown as ObjectId,
                `Payment Failed`,
                `Your payment attempt failed. Please try again.`,
                `mentee`,
                ""
              );

            socketManager.sendNotification(
              session.metadata.menteeId,
              notific as Inotification
            );
          }
          return;
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
        tabCond,
        "mentee"
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
      console.log(response);
      if (!response) {
        return {
          success: false,
          message: "result not found ",
          status: Status.NotFound,
          result: null,
        };
      }
      let title: string = "";
      let message: string = "";
      let url: string = "";
      if (statusValue === "CANCELLED") {
        const addToWallet = await this.__walletRepository.updateWalletAmount(
          response?.menteeId,
          Number(response?.paymentAmount)
        );
        let createWallet: Iwallet | null = null;
        if (!addToWallet) {
          createWallet = await this.__walletRepository.createWallet({
            userId: response?.menteeId,
            balance: Number(response?.paymentAmount),
          });
        }

        const newTranasaction = {
          amount: Number(response?.paymentAmount),
          walletId: (addToWallet
            ? addToWallet?._id
            : createWallet?.["_id"]) as ObjectId,
          transactionType: "credit",
          status: "completed",
          note: "slot cancelled amount refunded",
        };

        await this.__transactionRepository.createTransaction(newTranasaction);
        title = `cancel amount $${response?.paymentAmount} refunded`;
        message = "session cancel approved,amount credited to your wallet";
        url = `${process.env.CLIENT_ORIGIN_URL}/mentee/wallet`;
      } else {
        title = `cancel request rejected`;
        message = "session cancel rejected,attend the session on time";
        url = `${process.env.CLIENT_ORIGIN_URL}/mentee/bookings`;
      }

      const notif = await this._notificationRepository.createNotification(
        response?.menteeId,
        title,
        message,
        "mentee",
        url
      );

      if (notif) {
        socketManager.sendNotification(String(response?.menteeId), notif);
      }
      return {
        success: true,
        message: `${
          statusValue == "CANCELLED" ? "cancel approved" : "cancel rejected"
        } successfully`,
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
  async createSessionCode(bookingId: string): Promise<{
    success: boolean;
    message: string;
    status: number;
    sessionCode: string | null;
  }> {
    try {
      if (!bookingId) {
        return {
          success: false,
          message: "credential not found",
          status: Status.BadRequest,
          sessionCode: null,
        };
      }
      //generate sessionCode
      const session_Code = generateSessionCode();

      console.log(session_Code, "sessionCode");
      const response = await this._slotScheduleRepository.createSessionCode(
        bookingId,
        session_Code
      );

      if (!response) {
        return {
          success: false,
          message: "result not found ",
          status: Status.NotFound,
          sessionCode: null,
        };
      }
      console.log("response");
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
  }
  //session completed marking
  async sessionCompleted(
    bookingId: string,
    mentorId: ObjectId
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    sessionStatus: string | null;
  }> {
    try {
      if (!bookingId || !mentorId) {
        return {
          success: false,
          message: "credential not found",
          status: Status.BadRequest,
          sessionStatus: null,
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
          sessionStatus: null,
        };
      } 
      //calculate mentor cash;

      const mentorCommision =
        (parseInt(response?.paymentAmount) *parseInt(process.env.MENTOR_COMMISION as string))/100
        

      const result = await this.__walletRepository.findWallet(mentorId);
      let newWallet: Iwallet | null = null;
      if (!result) {
        newWallet = await this?.__walletRepository.createWallet({
          userId: mentorId as ObjectId,
          balance:mentorCommision,
        });
      }else{
        await this.__walletRepository.updateWalletAmount(
          mentorId,
          parseInt(response?.paymentAmount))
      }
      
      const newTranasaction = {
        amount: mentorCommision,
        walletId: (result ? result?._id : newWallet?.["_id"]) as ObjectId,
        transactionType: "credit",
        status: "completed",
        note: "earnings credited to account",
      };

     await this.__transactionRepository.createTransaction(newTranasaction);
    
     const notification =  await this._notificationRepository.createNotification(
        mentorId,
        "Earnings credited",
        "your earnings credited to your wallet.have a nice day",
        "mentor",
        `${process.env.CLIENT_ORIGIN_URL}/mentor/wallet`
      );
      if(notification){
        socketManager.sendNotification(String(mentorId),notification as Inotification)
      }
      console.log(notification)
      return {
        success: true,
        message: "marked as completed!",
        status: Status.Ok,
        sessionStatus: response?.status,
      };

    } catch (error: unknown) {
      throw new Error(
        `${
          error instanceof Error ? error.message : String(error)
        } error while chnage the session status as completed  in  service`
      );
    }
  }
  //validating user alloweded to join to the session
  async validateSessionJoin(
    sessionId: string,
    sessionCode: string
  ): Promise<{
    message: string;
    status: number;
    success: boolean;
    session_Code: string;
  }> {
    try {
      if (!sessionId || !sessionCode) {
        return {
          success: false,
          message: "credential not found",
          status: Status.BadRequest,
          session_Code: "",
        };
      }

      const response = await this._slotScheduleRepository.validateSessionJoin(
        sessionId,
        sessionCode
      );
      if (!response) {
        return {
          success: false,
          message: "result not found ",
          status: Status.NotFound,
          session_Code: "",
        };
      }
      return {
        success: true,
        message: "user Valid!",
        status: Status.Ok,
        session_Code: response?.sessionCode as string,
      };
    } catch (error: unknown) {
      throw new Error(
        `${
          error instanceof Error ? error.message : String(error)
        } error while validating user is alloweded to join the session`
      );
    }
  }
}
