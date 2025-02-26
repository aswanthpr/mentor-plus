import mongoose, { Schema, model, Document } from "mongoose";

export interface Ichat extends Document {
  _id:mongoose.Schema.Types.ObjectId
  menteeId: mongoose.Schema.Types.ObjectId;
  mentorId: mongoose.Schema.Types.ObjectId;
  lastMessage: string;
  createdAt: Date;
  updatedAt: Date;
}

export const chatSchema: Schema<Ichat> = new Schema(
  {
    menteeId: { type: mongoose.Types.ObjectId, ref: "mentee", required: true ,index:true},
    mentorId: { type: mongoose.Types.ObjectId, ref: "mentor", required: true ,index:true},
    lastMessage: {
      type: String,
      default:null
    },
  },
  {
    timestamps: true,
  }
);

export default model<Ichat>('chats',chatSchema);


