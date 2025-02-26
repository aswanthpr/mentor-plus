import mongoose, { Schema, Document } from "mongoose";
export interface Ichat extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    menteeId: mongoose.Schema.Types.ObjectId;
    mentorId: mongoose.Schema.Types.ObjectId;
    lastMessage: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const chatSchema: Schema<Ichat>;
declare const _default: mongoose.Model<Ichat, {}, {}, {}, mongoose.Document<unknown, {}, Ichat> & Ichat & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=chatSchema.d.ts.map