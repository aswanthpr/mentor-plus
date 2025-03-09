import mongoose, { Document } from "mongoose";
export interface Itransaction extends Document {
    transactionType: string;
    amount: number;
    note: string;
    balance: number;
    userId: mongoose.Schema.Types.ObjectId;
    userType: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<Itransaction, {}, {}, {}, mongoose.Document<unknown, {}, Itransaction> & Itransaction & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=transactionM.d.ts.map