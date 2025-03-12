import mongoose, { Document } from "mongoose";
export interface Ireview extends Document {
    menteeId: mongoose.Schema.Types.ObjectId;
    mentorId: mongoose.Schema.Types.ObjectId;
    sessionId: mongoose.Schema.Types.ObjectId;
    rating: number;
    feedback: string;
    createdAt?: Date;
    updatedAt?: Date;
}
declare const _default: mongoose.Model<Ireview, {}, {}, {}, mongoose.Document<unknown, {}, Ireview> & Ireview & Required<{
    _id: unknown;
}> & {
    __v: number;
}, mongoose.Schema<Ireview, mongoose.Model<Ireview, any, any, any, mongoose.Document<unknown, any, Ireview> & Ireview & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Ireview, mongoose.Document<unknown, {}, mongoose.FlatRecord<Ireview>> & mongoose.FlatRecord<Ireview> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>>;
export default _default;
//# sourceMappingURL=reviewModel.d.ts.map