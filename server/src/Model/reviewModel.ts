import  mongoose, {Document,model,Schema } from "mongoose";

export interface Ireview extends Document{
    menteeId:mongoose.Schema.Types.ObjectId;
    mentorId:mongoose.Schema.Types.ObjectId;
    sessionId:mongoose.Schema.Types.ObjectId;
    rating:number;
    feedback:string;
    createdAt?:Date;
    updatedAt?:Date;
}
const reviewSchema = new Schema<Ireview>({
    mentorId:{
        type:mongoose.Types.ObjectId,
        ref:"mentee",
        required:true,

    },
    menteeId:{
        type:mongoose.Types.ObjectId,
        ref:"mentor",
        required:true,
    },
    sessionId:{
        type:mongoose.Types.ObjectId,
        ref:"slotBooking",
        required:true,
    },
    rating:{
        type:Number,
        min:0,
        max:5,
        default:0
    },
    feedback:{
        type:String,
        default:null,
        
    },
},
{
    timestamps:true,
});

export default model("review",reviewSchema);
