import mongoose, { Document } from "mongoose";
export interface Iquestion extends Document {
    count?: number;
    title: string;
    content: string;
    tags: string[];
    menteeId: mongoose.Schema.Types.ObjectId;
    answers: number;
    isBlocked: boolean;
}
declare const _default: mongoose.Model<Iquestion, {}, {}, {}, mongoose.Document<unknown, {}, Iquestion> & Iquestion & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=questionModal.d.ts.map