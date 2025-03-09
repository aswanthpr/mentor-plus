import { ObjectId } from "mongoose";
import { Iwallet } from "src/Model/walletModel";
import Stripe from "stripe";
export interface IwalletService {
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
//# sourceMappingURL=IwalletService.d.ts.map