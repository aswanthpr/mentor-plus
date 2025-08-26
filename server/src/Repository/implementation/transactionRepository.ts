import { ObjectId } from "mongoose";
import { ItransactionRepository } from "../interface/ItransactionRepository";
import transactionSchema, { Itransaction} from "../../Model/transactionModel";
import { baseRepository } from "../baseRepo";
import { HttpError } from "../../Utils/http-error-handler.util";
import { Status } from "../../Constants/httpStatusCode";

class transactionRepository extends baseRepository<Itransaction> implements ItransactionRepository{
    constructor(){
        super(transactionSchema);
    }
   async createTransaction(newTranasaction: { amount: number; walletId: ObjectId; transactionType: string; status: string; note: string; }) {
        try {
            return await this.createDocument(newTranasaction);
        } catch (error:unknown) {
                throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
        }
    }

}
export default new transactionRepository();