import mongoose, { Schema, Document } from "mongoose";
export type Tpriority = 'less' | 'medium' | 'high';
export interface Inotification extends Document {
    userId: Schema.Types.ObjectId;
    title: string;
    message: string;
    isRead: boolean;
    userType: string;
    priority: Tpriority;
    isRemove: boolean;
    url?: string;
}
declare const _default: mongoose.Model<Inotification, {}, {}, {}, mongoose.Document<unknown, {}, Inotification> & Inotification & Required<{
    _id: unknown;
}> & {
    __v: number;
}, mongoose.Schema<Inotification, mongoose.Model<Inotification, any, any, any, mongoose.Document<unknown, any, Inotification> & Inotification & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Inotification, mongoose.Document<unknown, {}, mongoose.FlatRecord<Inotification>> & mongoose.FlatRecord<Inotification> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>>;
export default _default;
//# sourceMappingURL=notificationModel.d.ts.map