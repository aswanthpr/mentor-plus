import mongoose, { Schema, Document } from "mongoose";

export interface Iquestion extends Document {
  title: string;
  content: string; 
  tags: string[];
  menteeId:  mongoose.Schema.Types.ObjectId;
  answers:number
  isBlocked:boolean;
}

const questionSchema: Schema<Iquestion> = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    menteeId: {
      type: mongoose.Types.ObjectId,
      ref: "mentee",
      required: true,
    },
    answers: {
      type: Number,
      default: 0,
    },
    isBlocked:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);

export default mongoose.model<Iquestion>("Question", questionSchema);




