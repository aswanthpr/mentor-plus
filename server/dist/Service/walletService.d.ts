import { ObjectId } from "mongoose";
import { ItransactionRepository } from "../Interface/wallet/ItransactionRepository";
import { IwalletService } from "../Interface/wallet/IwalletService";
import Stripe from "stripe";
import { IwalletRepository } from "../Interface/wallet/IwalletRepository";
import { Iwallet } from "../Model/walletModel";
import { InotificationRepository } from "../Interface/Notification/InotificationRepository";
export declare class walletService implements IwalletService {
    private readonly __walletRepository;
    private readonly __transactionRepository;
    private readonly __notificationRepository;
    private readonly stripe;
    constructor(__walletRepository: IwalletRepository, __transactionRepository: ItransactionRepository, __notificationRepository: InotificationRepository, stripe?: Stripe);
    addMoenyToWallet(amount: number, userId: ObjectId): Promise<{
        message: string;
        status: number;
        success: boolean;
        session?: Stripe.Response<Stripe.Checkout.Session>;
    } | undefined>;
    walletStripeWebHook(signature: string | Buffer, bodyData: Buffer): Promise<void>;
    getWalletData(role: string, userId: ObjectId): Promise<{
        message: string;
        status: number;
        success: boolean;
        walletData: Iwallet | null;
    }>;
}
//# sourceMappingURL=walletService.d.ts.map