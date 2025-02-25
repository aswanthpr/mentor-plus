import mongoose, { Schema, Document } from "mongoose";
import { Ttype } from "src/Types/types";

export interface Inotification extends Document {
  _id:mongoose.Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  title: string;
  message: string;
  isRead: boolean;
  userType: Ttype;
  url?: string;
}

const notificatoinSchema: Schema<Inotification> = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      refPath: "userType",
      required: true,
    },
    userType: {
      type: String,
      required: true,
      enum: ["mentee", "mentor", "admin"],
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    url: { type: String, default: null },
  },
  {
    timestamps: true,
    capped:{max:10,size:1000000}
  }
);
export default mongoose.model("notification", notificatoinSchema);
