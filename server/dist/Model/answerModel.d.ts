import mongoose, { Document } from 'mongoose';
export interface Ianswer extends Document {
    answer: string;
    authorId: mongoose.Schema.Types.ObjectId;
    authorType: string;
    questionId: mongoose.Schema.Types.ObjectId;
    isBlocked: boolean;
}
declare const _default: mongoose.Model<Ianswer, {}, {}, {}, mongoose.Document<unknown, {}, Ianswer> & Ianswer & Required<{
    _id: unknown;
}> & {
    __v: number;
}, mongoose.Schema<Ianswer, mongoose.Model<Ianswer, any, any, any, mongoose.Document<unknown, any, Ianswer> & Ianswer & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Ianswer, mongoose.Document<unknown, {}, mongoose.FlatRecord<Ianswer>> & mongoose.FlatRecord<Ianswer> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>>;
export default _default;
//# sourceMappingURL=answerModel.d.ts.map