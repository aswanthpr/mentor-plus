import mongoose, { Schema, Document } from "mongoose";
export interface Iwallet extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    userId: mongoose.Schema.Types.ObjectId;
    balance: number;
}
declare const _default: mongoose.Model<Iwallet, {}, {}, {}, mongoose.Document<unknown, {}, Iwallet> & Iwallet & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}, mongoose.Schema<Iwallet, mongoose.Model<Iwallet, any, any, any, mongoose.Document<unknown, any, Iwallet> & Iwallet & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Iwallet, mongoose.Document<unknown, {}, mongoose.FlatRecord<Iwallet>> & mongoose.FlatRecord<Iwallet> & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}>>;
export default _default;
//# sourceMappingURL=walletModel.d.ts.map