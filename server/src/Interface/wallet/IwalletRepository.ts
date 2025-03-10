import { ObjectId } from "mongoose";
import { Iwallet } from "../../Model/walletModel";

export interface IwalletRepository {
    createWallet(walletData: Partial<Iwallet>): Promise<Iwallet | null>;
    findWallet(userId: ObjectId): Promise<Iwallet | null>;
    updateWalletAmount(userId:ObjectId, amount: number): Promise<Iwallet | null>
    findWalletWithTransaction(userId: ObjectId): Promise<Iwallet | null>;
    deductAmountFromWallet(amount: number, userId: ObjectId): Promise<Iwallet | null>;
}