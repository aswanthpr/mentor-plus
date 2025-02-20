import mongoose, { Schema, Types, model, Document } from "mongoose";

export interface Ichat extends Document {
  _id:mongoose.Schema.Types.ObjectId
  menteeId: mongoose.Schema.Types.ObjectId;
  mentorId: mongoose.Schema.Types.ObjectId;
  lastMessage: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
} 

export const chatRoomSchema: Schema<Ichat> = new Schema(
  {
    menteeId: { type: mongoose.Types.ObjectId, ref: "mentee", required: true ,index:true},
    mentorId: { type: mongoose.Types.ObjectId, ref: "mentor", required: true ,index:true},
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "message",
      default:null
    },
  },
  {
    timestamps: true,
  }
);


export default model<Ichat>('chats',chatRoomSchema);
