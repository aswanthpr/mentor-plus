import mongoose, { ObjectId } from "mongoose";
import { ItransactionRepository } from "../Interface/wallet/ItransactionRepository";
import { IwalletService } from "../Interface/wallet/IwalletService";
import { Status } from "../Constants/httpStatusCode";
import Stripe from "stripe";
import { IwalletRepository } from "../Interface/wallet/IwalletRepository";
import { Iwallet } from "../Model/walletModel";
import { InotificationRepository } from "../Interface/Notification/InotificationRepository";
import { socketManager } from "../index";
import { Itransaction } from "../Model/transactionModel";
import { createSkip } from "../Utils/reusable.util";
import { HttpResponse } from "../Constants/httpResponse";
import { HttpError } from "../Utils/http-error-handler.util";

export class walletService implements IwalletService {
  constructor(
    private readonly __walletRepository: IwalletRepository,
    private readonly __transactionRepository: ItransactionRepository,
    private readonly __notificationRepository: InotificationRepository,
    private readonly stripe: Stripe = new Stripe(
      process.env.STRIPE_SECRET_KEY as string,
      { maxNetworkRetries: 5 }
    )
  ) { }
  //add money wallet
  async addMoenyToWallet(
    amount: number,
    userId: ObjectId
  ): Promise<
    | {
      message: string;
      status: number;
      success: boolean;
      session?: Stripe.Response<Stripe.Checkout.Session>;
    }
    | undefined
  > {
    try {
      if (!amount || !userId) {
        return {
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status?.BadRequest,
          success: false,
        };
      }
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              unit_amount: amount * 100,
              product_data: {
                name: "Wallet Top-up",
                description: "Add funds to your wallet",
              },
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env?.CLIENT_ORIGIN_URL}/mentee/wallet?success=true`,
        cancel_url: `${process.env?.CLIENT_ORIGIN_URL}/mentee/stripe-cancel?cancelled=true`,
        metadata: {
          userId: userId.toString(),
          amount,

        },
        custom_text: {
          submit: { message: "Complete Secure Payment" },
        },
      });

    
      return {
        message: HttpResponse?.PAYMENT_INTENT_CREATED,
        status: Status?.Ok,
        success: true,
        session,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
  async walletStripeWebHook(
    signature: string | Buffer,
    bodyData: Buffer
  ): Promise<void> {
    try {
      if (!signature || !bodyData) {
        throw new Error(HttpResponse?.WEBHOOK_SIGNATURE_MISSING);
      }
     
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let event: any;
      try {
        event = this.stripe.webhooks.constructEvent(
          bodyData,
          signature as string | Buffer,
          process.env.STRIPE_WEBHOOK_WALLET_SECRET as string
        );
      } catch (error: unknown) {
        throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);

      }
      // console.log("🔔 Received webhook event:");

      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          const metaData = session.metadata || {};

         
          if (!session.metadata) {
            // console.error("Missing metadata in Stripe session");
            return;
          }
          const { amount, userId } = metaData;

          if (!mongoose.Types.ObjectId.isValid(userId)) {
            // console.error("Invalid menteeId format:", userId);
            return;
          }
          const menteeId = new mongoose.Types.ObjectId(
            userId
          ) as unknown as mongoose.Schema.Types.ObjectId;

          const response = (await this.__walletRepository.findWallet(
            menteeId as ObjectId
          )) as Iwallet;

          let newWallet: Iwallet | null = null;
          if (!response) {
            newWallet = await this.__walletRepository.createWallet({
              userId: menteeId,
              balance: 0,
            } as Iwallet);
          } else {
            await this.__walletRepository.updateWalletAmount(
              menteeId,
              Number(amount)
            );
          }

          const newTranasaction = {
            amount: Number(amount),
            walletId: (response
              ? response?.["_id"]
              : newWallet?._id) as ObjectId,
            transactionType: "credit",
            status: "completed",
            note: "wallet top-up",
          };
          await this.__transactionRepository.createTransaction(newTranasaction);

          const notification =
            await this.__notificationRepository.createNotification(
              menteeId,
              "money added to wallet",
              "wallet balance added successfully!",
              "mentee",
              `${process.env.CLIENT_ORIGIN_URL}/mentee/wallet`
            );
          //real time notification
          if (menteeId && notification) {
            socketManager.sendNotification(userId as string, notification);
          }

        }
      }
      return;
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
  //fetch wallet data ;
  async getWalletData(
    userId: ObjectId,
    role: string,
    search: string,
    filter: string,
    page: number,
    limit: number): Promise<{
      message: string;
      status: number;
      success: boolean;
      walletData: Iwallet | null;
      totalPage: number;
    }> {
    try {
      if (!userId || !role || !filter || page < 1 || limit < 1) {
        return {
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status?.BadRequest,
          success: false,
          walletData: null,
          totalPage: 0
        };
      }
      const skipData = createSkip(page, limit);
      const limitNo = skipData?.limitNo;
      const skip = skipData?.skip;


      const result = await this.__walletRepository.findWalletWithTransaction(
        userId,
        skip,
        limit,
        search,
        filter,
      );
      const totalPage = result?.totalDocs > 0 ? Math.ceil(result?.totalDocs / limitNo) : 1;
      
      return {
        message: HttpResponse?.DATA_RETRIEVED,
        status: Status?.Ok,
        success: true,
        walletData: result?.transaction,
        totalPage
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
  async withdrawMentorEarnings(
    amount: number,
    userId: ObjectId
  ): Promise<{
    message: string;
    status: number;
    success: boolean;
    result: Itransaction | null;
  }> {
    try {

      if (!amount || !userId) {

        return {
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status?.BadRequest,
          success: false,
          result: null,
        };
      }
      if (typeof amount !== 'number' && amount < 500) {

        return {
          message: "Withdrawals below $500 are not allowed. Please enter a higher amount",
          status: Status?.BadRequest,
          success: false,
          result: null,
        };
      }

      const result = await this.__walletRepository.deductAmountFromWallet(
        amount,
        userId
      );

      if (!result) {

        return {
          message: HttpResponse?.RESOURCE_NOT_FOUND,
          status: Status?.BadRequest,
          success: false,
          result: null,
        };
      }
      const newTranasaction = {
        amount: Number(amount),
        walletId: result?._id,
        transactionType: "debit",
        status: "completed",
        note: "balance withdrawed ",
      };
      const transaction = await this.__transactionRepository.createTransaction(
        newTranasaction
      );

      const notification =
        await this.__notificationRepository.createNotification(
          result?.userId,
          "withdraw balance",
          "money deducted. shortly credited in bank!",
          "mentor",
          `${process.env.CLIENT_ORIGIN_URL}/mentor/wallet`
        );
      //real time notification
      if (result?._id && notification) {
        socketManager.sendNotification(
          String(result?._id) as string,
          notification
        );
      }
      return {
        message: HttpResponse?.APPLIED_FOR_WITHDRAW,
        status: Status?.Ok,
        success: true,
        result: transaction as Itransaction,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
}
