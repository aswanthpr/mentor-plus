import { ObjectId } from "mongoose";
import { ItransactionRepository } from "../Interface/wallet/ItransactionRepository";
import transactionSchema, { Itransaction} from "../Model/transactionModel";
import { baseRepository } from "./baseRepo";

class transactionRepository extends baseRepository<Itransaction> implements ItransactionRepository{
    constructor(){
        super(transactionSchema);
    }
   async createTransaction(newTranasaction: { amount: number; walletId: ObjectId; transactionType: string; status: string; note: string; }) {
        try {
            return await this.createDocument(newTranasaction);
        } catch (error:unknown) {
            throw new Error(`${error instanceof Error ? error.message:String(error)}`);
        }
    }

}
export default new transactionRepository();