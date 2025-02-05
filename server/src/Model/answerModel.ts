import mongoose, { Schema,Document } from 'mongoose';

 
export  interface Ianswer extends Document { 
    answer: string;
    authorId:  mongoose.Schema.Types.ObjectId;
    authorType: string;
    questionId:  mongoose.Schema.Types.ObjectId;
    isBlocked:boolean;
}

const answerSchema: Schema<Ianswer> = new Schema( 
    {
        answer: {
            type: String,
            required: true,
        },
        authorId: {
            type: mongoose.Types.ObjectId,
            refPath: 'authorType',
            required: true,
        },
        authorType: {
            type: String,
            required: true,
            enum: ['mentee','mentor']
        },
        questionId: {
            type: mongoose.Types.ObjectId,
            ref: 'Question',
            required: true
        },
        isBlocked:{
            type:Boolean,
            default:false
          }
    }, { timestamps: true })

export default mongoose.model('Answer', answerSchema)

