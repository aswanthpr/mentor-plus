import mongoose, { Document } from "mongoose";
export interface IQa extends Document {
    title: string;
    body: string;
    tags: string[];
    menteeId: mongoose.Schema.Types.ObjectId;
    mentorId: mongoose.Schema.Types.ObjectId;
    answerId: mongoose.Schema.Types.ObjectId[];
}
declare const _default: mongoose.Model<IQa, {}, {}, {}, mongoose.Document<unknown, {}, IQa> & IQa & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=qaModal.d.ts.map