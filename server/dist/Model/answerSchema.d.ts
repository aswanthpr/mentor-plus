import mongoose, { Document } from 'mongoose';
interface Ianswer extends Document {
    content: string;
    author: mongoose.Schema.Types.ObjectId;
    authorModel: string;
    questionId: mongoose.Schema.Types.ObjectId;
}
declare const answerModel: mongoose.Model<Ianswer, {}, {}, {}, mongoose.Document<unknown, {}, Ianswer> & Ianswer & Required<{
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
export default answerModel;
//# sourceMappingURL=answerSchema.d.ts.map