import mongoose, { ObjectId } from "mongoose";
import { ItransactionRepository } from "../Interface/wallet/ItransactionRepository";
import { IwalletService } from "../Interface/wallet/IwalletService";
import { Status } from "../Utils/httpStatusCode";
import Stripe from "stripe";
import { IwalletRepository } from "../Interface/wallet/IwalletRepository";
import { Iwallet } from "../Model/walletModel";
import { InotificationRepository } from "../Interface/Notification/InotificationRepository";
import { socketManager } from "../index";

export class walletService implements IwalletService {
  constructor(
    private readonly __walletRepository: IwalletRepository,
    private readonly __transactionRepository: ItransactionRepository,
    private readonly __notificationRepository: InotificationRepository,
    private readonly stripe: Stripe = new Stripe(
      process.env.STRIPE_SECRET_KEY as string,
      { maxNetworkRetries: 5 }
    )
  ) {}
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
          message: "credential not found",
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

      console.log(session);
      return {
        message: "payment intent created",
        status: Status?.Ok,
        success: true,
        session,
      };
    } catch (error: unknown) {
      throw new Error(
        `error while add money to wallet ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async walletStripeWebHook(
    signature: string | Buffer,
    bodyData: Buffer
  ): Promise<void> {
    try {
      if (!signature || !bodyData) {
        throw new Error("Missing signature or body data in webhook request.");
      }
      console.log(signature, bodyData, "singature and bodydata");
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
      console.log("🔔 Received webhook event:");

      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          const metaData = session.metadata || {};
          if (!session.metadata) {
            console.error("Missing metadata in Stripe session");
            return;
          }
          const { amount, userId } = metaData;

          if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.error("Invalid menteeId format:", userId);
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
            transactionType: "deposit",
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
      throw new Error(
        `${
          error instanceof Error ? error.message : String(error)
        } error while webhook handling in mentee service`
      );
    }
  }
  //fetch wallet data ;
  async getWalletData(
    userId: ObjectId
  ): Promise<{
    message: string;
    status: number;
    success: boolean;
    walletData: Iwallet | null;
  }> {
    try {
      if (!userId) {
        return {
          message: "credential not found",
          status: Status?.BadRequest,
          success: false,
          walletData: null,
        };
      }

      const result = await this.__walletRepository.findWalletWithTransaction(
        userId
      );
      return {
        message: "successfully receive data",
        status: Status?.Ok,
        success: true,
        walletData: result,
      };
    } catch (error: unknown) {
      throw new Error(
        `${
          error instanceof Error ? error.message : String(error)
        } error while fetching user wallet Data`
      );
    }
  }
}
