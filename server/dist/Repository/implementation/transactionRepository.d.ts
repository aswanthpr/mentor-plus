import { ObjectId } from "mongoose";
import { ItransactionRepository } from "../interface/ItransactionRepository";
import { Itransaction } from "../../Model/transactionModel";
import { baseRepository } from "../baseRepo";
declare class transactionRepository extends baseRepository<Itransaction> implements ItransactionRepository {
    constructor();
    createTransaction(newTranasaction: {
        amount: number;
        walletId: ObjectId;
        transactionType: string;
        status: string;
        note: string;
    }): Promise<Itransaction>;
}
declare const _default: transactionRepository;
export default _default;
//# sourceMappingURL=transactionRepository.d.ts.map