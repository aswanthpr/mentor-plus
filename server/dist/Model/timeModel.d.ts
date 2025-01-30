import mongoose, { Document, Schema } from "mongoose";
export interface slot {
    startTime: Date;
    startStr: string;
    endTime: Date;
    endStr: string;
}
export interface Itime extends Document {
    startDate: Date;
    slots: slot[];
    price: string;
    isBooked?: boolean;
    mentorId: mongoose.Schema.Types.ObjectId;
}
export declare const timeSchema: Schema<Itime>;
declare const _default: mongoose.Model<Itime, {}, {}, {}, mongoose.Document<unknown, {}, Itime> & Itime & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=timeModel.d.ts.map