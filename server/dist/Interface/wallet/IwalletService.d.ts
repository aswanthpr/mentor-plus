import { ObjectId } from "mongoose";
import { Itransaction } from "../../Model/transactionModel";
import { Iwallet } from "../../Model/walletModel";
import Stripe from "stripe";
export interface IwalletService {
    addMoenyToWallet(amount: number, userId: ObjectId): Promise<{
        message: string;
        status: number;
        success: boolean;
        session?: Stripe.Response<Stripe.Checkout.Session>;
    } | undefined>;
    walletStripeWebHook(signature: string | Buffer, bodyData: Buffer): Promise<void>;
    getWalletData(userId: ObjectId, role: string, search: string, filter: string, page: number, limit: number): Promise<{
        message: string;
        status: number;
        success: boolean;
        walletData: Iwallet | null;
        totalPage: number;
    }>;
    withdrawMentorEarnings(amount: number, userId: ObjectId): Promise<{
        message: string;
        status: number;
        success: boolean;
        result: Itransaction | null;
    }>;
}
//# sourceMappingURL=IwalletService.d.ts.map