import { Iwallet } from "../Model/walletModel";
import { IwalletRepository } from "../Interface/wallet/IwalletRepository";
import { baseRepository } from "./baseRepo";
import { ObjectId } from "mongoose";
declare class walletRepository extends baseRepository<Iwallet> implements IwalletRepository {
    constructor();
    createWallet(walletData: Partial<Iwallet>): Promise<Iwallet | null>;
    findWallet(userId: ObjectId): Promise<Iwallet | null>;
    updateWalletAmount(userId: ObjectId, amount: number): Promise<Iwallet | null>;
    findWalletWithTransaction(userId: ObjectId, skip: number, limit: number, search: string, filter: string): Promise<{
        transaction: Iwallet | null;
        totalDocs: number;
    }>;
    deductAmountFromWallet(amount: number, userId: ObjectId): Promise<Iwallet | null>;
}
declare const _default: walletRepository;
export default _default;
//# sourceMappingURL=walletRepository.d.ts.map