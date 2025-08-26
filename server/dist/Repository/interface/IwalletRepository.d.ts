import { ObjectId } from "mongoose";
import { Iwallet } from "../../Model/walletModel";
export interface IwalletRepository {
    createWallet(walletData: Partial<Iwallet>): Promise<Iwallet | null>;
    findWallet(userId: ObjectId): Promise<Iwallet | null>;
    updateWalletAmount(userId: ObjectId, amount: number): Promise<Iwallet | null>;
    findWalletWithTransaction(userId: ObjectId, skip: number, limit: number, search: string, filter: string): Promise<{
        transaction: Iwallet | null;
        totalDocs: number;
    }>;
    deductAmountFromWallet(amount: number, userId: ObjectId): Promise<Iwallet | null>;
}
//# sourceMappingURL=IwalletRepository.d.ts.map