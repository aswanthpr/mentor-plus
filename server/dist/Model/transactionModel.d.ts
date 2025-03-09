import mongoose, { Document } from "mongoose";
export interface Itransaction extends Document {
    transactionType: string;
    amount: number;
    note: string;
    walletId: mongoose.Schema.Types.ObjectId;
    status: string;
    createdA?: Date;
    updatedAt?: Date;
}
declare const _default: mongoose.Model<Itransaction, {}, {}, {}, mongoose.Document<unknown, {}, Itransaction> & Itransaction & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=transactionModel.d.ts.map