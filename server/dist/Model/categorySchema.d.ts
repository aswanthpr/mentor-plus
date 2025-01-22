import mongoose, { Document } from "mongoose";
export interface Icategory extends Document {
    category: string;
    isBlocked?: boolean;
}
declare const _default: mongoose.Model<Icategory, {}, {}, {}, mongoose.Document<unknown, {}, Icategory> & Icategory & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=categorySchema.d.ts.map