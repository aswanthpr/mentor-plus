import mongoose, { Schema,Document } from 'mongoose';


export  interface Ianswer extends Document { 
    answer: string;
    authorId: mongoose.Schema.Types.ObjectId;
    authorType: string;
    questionId: mongoose.Schema.Types.ObjectId;
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
            enum: ['mentees', 'mentors']
        },
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
            required: true
        }
    }, { timestamps: true })

export default mongoose.model('Answer', answerSchema)

