import mongoose, { Schema, model, Document } from "mongoose";

export type TmessageType = "text" | "image"| "document";
export interface Imessage extends Document {
  chatId: mongoose.Schema.Types.ObjectId;
  senderId:  mongoose.Schema.Types.ObjectId;
  receiverId:  mongoose.Schema.Types.ObjectId;
  senderType: "mentee" | "mentor";
  content: string;
  seen: boolean; 
  messageType: TmessageType;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema: Schema<Imessage> = new Schema(
  {
    chatId: {
      type: mongoose.Types.ObjectId,
      ref: "chat",
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Types.ObjectId,
      refPath: "senderType",
      required: true,
      index: true,
    },
    receiverId: { type:mongoose.Types.ObjectId, required: true, index: true },
    senderType: { type: String, enum: ["mentee", "mentor"], required: true },
    content: { type: String,default:null },
    messageType: {
      type: String,
      enum: ["text", "image","document"],
      default: "text",
    },
    seen: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default model<Imessage>("message", messageSchema);
 