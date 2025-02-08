import mongoose, { Document } from "mongoose";
export interface IslotSchedule extends Document {
    menteeId: mongoose.Schema.Types.ObjectId;
    status: string;
    slotId: mongoose.Schema.Types.ObjectId;
    isAttended?: boolean;
    isExpired?: boolean;
    paymentStatus: string;
    paymentMethod: string;
    paymentAmount: string;
    paymentTime: string;
    duration: string;
    meetingLink?: string | null;
    description: string;
}
declare const _default: mongoose.Model<IslotSchedule, {}, {}, {}, mongoose.Document<unknown, {}, IslotSchedule> & IslotSchedule & Required<{
    _id: unknown;
}> & {
    __v: number;
}, mongoose.Schema<IslotSchedule, mongoose.Model<IslotSchedule, any, any, any, mongoose.Document<unknown, any, IslotSchedule> & IslotSchedule & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IslotSchedule, mongoose.Document<unknown, {}, mongoose.FlatRecord<IslotSchedule>> & mongoose.FlatRecord<IslotSchedule> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>>;
export default _default;
//# sourceMappingURL=slotSchedule.d.ts.map