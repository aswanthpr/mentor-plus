import { ObjectId } from "mongoose";

export interface  ItransactionRepository{
  createTransaction(newTranasaction: { amount: number; walletId: ObjectId; transactionType: string; status: string; note: string; }): unknown;

}