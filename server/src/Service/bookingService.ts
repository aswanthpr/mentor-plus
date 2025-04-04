import { Stripe } from "stripe";
import { IbookingService } from "../Interface/Booking/iBookingService";
import { IslotScheduleRepository } from "../Interface/Booking/iSlotScheduleRepository";
import { ItimeSlotRepository } from "../Interface/Booking/iTimeSchedule";
import mongoose, { ObjectId } from "mongoose";
import { InewSlotSchedule, Itimes } from "../Types";
import { IslotSchedule } from "../Model/slotSchedule";
import { Status } from "../Constants/httpStatusCode";
import { Itime } from "../Model/timeModel";
import { InotificationRepository } from "../Interface/Notification/InotificationRepository";
import moment from "moment";
import { socketManager } from "../index";
import { Inotification } from "../Model/notificationModel";
import { IchatRepository } from "../Interface/chat/IchatRepository";
import { createSkip, generateSessionCode } from "../Utils/reusable.util";
import { Iwallet } from "../Model/walletModel";
import { IwalletRepository } from "../Interface/wallet/IwalletRepository";
import { ItransactionRepository } from "../Interface/wallet/ItransactionRepository";
import { HttpResponse, NOTIFY } from "../Constants/httpResponse";
import { HttpError } from "../Utils/http-error-handler.util";

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
  ) { }

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
          message: HttpResponse?.INVALID_CREDENTIALS,
          success: false,
          timeSlots: [],
        };
      }
      const response = await this._timeSlotRepository.getMentorSlots(mentorId);
      if (!response) {
        return {
          status: Status.Ok,
          message: HttpResponse?.RESOURCE_NOT_FOUND,
          success: false,
          timeSlots: [],
        };
      }
   
      return {
        status: Status.Ok,
        message: HttpResponse?.DATA_RETRIEVED,
        success: true,
        timeSlots: response,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
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
    

      if (!timeSlot || !messages || !paymentMethod || !totalAmount) {
        return {
          status: Status.BadRequest,
          message: HttpResponse?.INVALID_CREDENTIALS,
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
                  description: `Slot date is: ${String(timeSlot?.startDate).split("T")[0]
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
          message: HttpResponse?.SUCCESS,
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
            message: HttpResponse?.INSUFFICINET_BALANCE,
            status: Status?.BadRequest,
            success: false,
          };
        }

        const time = new Date().toLocaleString();
      

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
          message: HttpResponse?.SLOT_BOOKED,
          status: Status?.Ok,
          success: true,
        };
      }

      return {
        success: false,
        message: HttpResponse?.SOMETHING_WENT_WRONG,
        status: Status.BadRequest,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
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
          process.env.STRIPE_WEBHOOK_BOOKING_SECRET as string
        );
      } catch (error: unknown) {
        throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);

      }

      // console.log("🔔 Received webhook event:", event.type);

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
            // console.error("❌ Invalid or missing metadata in Stripe webhook");

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
            // console.error("Invalid menteeId format:", menteeId);
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
            // console.error("❌ Payment failed. Redirecting to error page.");

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
          const totalAmount = (session?.amount_total || 0) / 100;
          const time = new Date(session?.created * 1000).toISOString();

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
              NOTIFY?.SLOT_SCHEDULE_TITLE,
              NOTIFY?.SLOT_SCHEDULED,
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
          // console.error("❌ Payment Failed or Expired:");

          if (session.metadata && session.metadata.menteeId) {
            await this._notificationRepository.createNotification(
              session.metadata.menteeId as unknown as ObjectId,
              NOTIFY?.PAYMENT_FAILED,
              NOTIFY?.PAYMENT_ATTEMPT_FALED,
              `mentee`,
              ""
            );
          }
          return;
        }
        case "payment_intent.payment_failed": {
          const session = event.data.object as Stripe.Checkout.Session;
          // console.error("❌ Payment Failed:");

          if (session.metadata && session.metadata.menteeId) {
            const notific =
              await this._notificationRepository.createNotification(
                session.metadata.menteeId as unknown as ObjectId,
                NOTIFY?.PAYMENT_FAILED,
                NOTIFY?.PAYMENT_ATTEMPT_FALED,
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
          // console.log(`Unhandled event type ${event.type}`);
      }
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }

  //fetch mentee booked slots

  async getBookedSlots(
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
  }> {
    try {
      if (
        !menteeId ||
        !currentTab ||
        !sortField ||
        !filter ||
        !sortOrder ||
        page < 1 ||
        limit < 1 ||
        !mongoose.Types.ObjectId.isValid(String(menteeId))
      ) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status.BadRequest,
          slots: [],
          totalPage: 0,
        };
      }
      const skipData = createSkip(page, limit);
      const limitNo = skipData?.limitNo;
      const skip = skipData?.skip;

      const tabCond = currentTab == "upcoming" ? false : true;
     

      const response = await this._slotScheduleRepository.getBookedSlot(
        menteeId,
        tabCond,
        "mentee",
        skip,
        limitNo,
        search,
        sortOrder,
        sortField,
        filter
      );

      if (response?.slots.length < 0 || response?.totalDocs < 0) {
        return {
          success: false,
          message: HttpResponse?.RESOURCE_NOT_FOUND,
          status: Status.Ok,
          slots: [],
          totalPage: 0,
        };
      }
      const totalPage = Math.ceil(response?.totalDocs / limitNo);
      return {
        success: true,
        message: HttpResponse?.RESOURCE_FOUND,
        status: Status.Ok,
        slots: response?.slots,
        totalPage,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }

  async getBookedSessions(
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
    totalPage: number;
  }> {
    try {
   
      if (
        !mentorId ||
        !currentTab ||
        !sortField ||
        !sortOrder ||
        !filter ||
        page < 1 ||
        limit < 1 ||
        !mongoose.Types.ObjectId.isValid(String(mentorId))
      ) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status.NotFound,
          slots: [],
          totalPage: 0,
        };
      }
      const tabCond = currentTab == "upcoming" ? false : true;
      const skipData = createSkip(page, limit);
      const limitNo = skipData?.limitNo;
      const skip = skipData?.skip;
      const response = await this._slotScheduleRepository.getBookedSession(
        skip,
        limitNo,
        search,
        filter,
        sortOrder,
        sortField,
        tabCond,
        mentorId,
      );
      if (response?.slots.length < 0 || response?.totalDoc < 0) {
        return {
          success: false,
          message: HttpResponse?.RESOURCE_NOT_FOUND,
          status: Status.Ok,
          slots: [],
          totalPage: 0,
        };
      }
      const totalPage = Math.ceil(response?.totalDoc / limitNo);

      return {
        success: true,
        message: HttpResponse?.RESOURCE_FOUND,
        status: Status.Ok,
        slots: response?.slots,
        totalPage,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
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
          message: HttpResponse?.INVALID_CREDENTIALS,
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
          message: HttpResponse?.FAILED,
          status: Status.NotFound,
          result: null,
        };
      }
      return {
        success: true,
        message: HttpResponse?.SLOT_CANCEL_REQUESTED,
        status: Status.Ok,
        result: response,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
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
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status.BadRequest,
          result: null,
        };
      }

      const response = await this._slotScheduleRepository.mentorSlotCancel(
        sessionId,
        statusValue
      );
      await this._timeSlotRepository.releaseTimeSlot(String(response?.slotId));
    
      if (!response) {
        return {
          success: false,
          message: HttpResponse?.RESOURCE_NOT_FOUND,
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
          note: NOTIFY?.CANCELLD_AMOUNT_CREDIT,
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
        message: `${statusValue == "CANCELLED" ? "cancel approved" : "cancel rejected"
          } successfully`,
        status: Status.Ok,
        result: response,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
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
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status.BadRequest,
          sessionCode: null,
        };
      }
      //generate sessionCode
      const session_Code = generateSessionCode();

    
      const response = await this._slotScheduleRepository.createSessionCode(
        bookingId,
        session_Code
      );

      if (!response) {
        return {
          success: false,
          message: HttpResponse?.RESOURCE_NOT_FOUND,
          status: Status.NotFound,
          sessionCode: null,
        };
      }
     
      return {
        success: true,
        message: HttpResponse?.SESSION_CODE_CREATED,
        status: Status.Ok,
        sessionCode: response,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
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
          message: HttpResponse?.INVALID_CREDENTIALS,
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
          message: HttpResponse?.RESOURCE_NOT_FOUND,
          status: Status.NotFound,
          sessionStatus: null,
        };
      }
      //calculate mentor cash;

      const mentorCommision =
        (parseInt(response?.paymentAmount) *
          parseInt(process.env.MENTOR_COMMISION as string)) /
        100;

      const result = await this.__walletRepository.findWallet(mentorId);
      let newWallet: Iwallet | null = null;
      if (!result) {
        newWallet = await this?.__walletRepository.createWallet({
          userId: mentorId as ObjectId,
          balance: mentorCommision,
        });
      } else {
        await this.__walletRepository.updateWalletAmount(
          mentorId,
          mentorCommision
        );
      }

      const newTranasaction = {
        amount: mentorCommision,
        walletId: (result ? result?._id : newWallet?.["_id"]) as ObjectId,
        transactionType: "credit",
        status: "completed",
        note: NOTIFY?.EARNINGS_CREDITED_TO_WALLET,
      };

      await this.__transactionRepository.createTransaction(newTranasaction);

      const notification =
        await this._notificationRepository.createNotification(
          mentorId,
          NOTIFY?.EARNING_CREDITED,
          NOTIFY?.EARNING_CREDIT_MESSAGE,
          "mentor",
          `${process.env.CLIENT_ORIGIN_URL}/mentor/wallet`
        );
      if (notification) {
        socketManager.sendNotification(
          String(mentorId),
          notification as Inotification
        );
      }
   
      return {
        success: true,
        message: HttpResponse?.SESSION_COMPLETED,
        status: Status.Ok,
        sessionStatus: response?.status,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
  //validating user alloweded to join to the session
  async validateSessionJoin(
    sessionId: string,
    sessionCode: string,
    userId: ObjectId,
  ): Promise<{
    message: string;
    status: number;
    success: boolean;
    session_Code: string;
  }> {
    try {
  
      if (!sessionId || !sessionCode || !userId) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status.BadRequest,
          session_Code: "",
        };
      }

      const response = await this._slotScheduleRepository.validateSessionJoin(
        new mongoose.Types.ObjectId(sessionId) as unknown as mongoose.Schema.Types.ObjectId,
        sessionCode,
        userId,
      );
      if (!response) {
        return {
          success: false,
          message: HttpResponse?.RESOURCE_NOT_FOUND,
          status: Status.NotFound,
          session_Code: "",
        };
      }
      return {
        success: true,
        message: HttpResponse?.USER_VERIFIED,
        status: Status.Ok,
        session_Code: response?.sessionCode as string,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
}
