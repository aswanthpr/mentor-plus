import mongoose, { Schema, Document } from "mongoose";
import { Ttype } from "src/Types/types";
export interface Inotification extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
    title: string;
    message: string;
    isRead: boolean;
    userType: Ttype;
    url?: string;
}
declare const _default: mongoose.Model<Inotification, {}, {}, {}, mongoose.Document<unknown, {}, Inotification> & Inotification & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}, mongoose.Schema<Inotification, mongoose.Model<Inotification, any, any, any, mongoose.Document<unknown, any, Inotification> & Inotification & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Inotification, mongoose.Document<unknown, {}, mongoose.FlatRecord<Inotification>> & mongoose.FlatRecord<Inotification> & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}>>;
export default _default;
//# sourceMappingURL=notificationModel.d.ts.map