import mongoose, { Schema, Document } from "mongoose";

export interface Iquestion extends Document {
  title: string;
  content: string;
  tags: string[];
  menteeId: mongoose.Schema.Types.ObjectId;
  answers:number
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentee",
      required: true,
    },
    answers: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model<Iquestion>("Question", questionSchema);
