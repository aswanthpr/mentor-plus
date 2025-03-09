import mongoose, { Schema,Document,model } from "mongoose";

export interface Iwallet extends Document{
   _id:mongoose.Schema.Types.ObjectId
    userId:mongoose.Schema.Types.ObjectId;
    balance:number;

}
const walletSchema = new Schema<Iwallet>({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "mentees",
        index: true,
      },
    balance:{
        type:Number,
        required:true,

    }
},
{
timestamps:true
});

export default model("wallet",walletSchema);