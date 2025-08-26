import mongoose, { Schema, Document } from 'mongoose';
import { Iquestion } from './questionModal';
export interface Ianswer extends Document {
    name: string;
    answer: string;
    authorId: mongoose.Schema.Types.ObjectId;
    authorType: string;
    questionId: mongoose.Schema.Types.ObjectId | Iquestion;
    isBlocked: boolean;
}
export declare const answerSchema: Schema<Ianswer>;
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