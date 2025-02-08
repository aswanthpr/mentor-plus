import mongoose, { Schema, Document } from "mongoose";

export type  Tpriority = 'less'|'medium'|'high';

export interface Inotification extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  message: string;
  isRead: boolean;
  userType: string;
  priority:Tpriority;
  isRemove:boolean;
  url?:string
}

const notificatoinSchema: Schema<Inotification> = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      refPath: "userType",
      required: true,
    },
    userType: { type: String, required: true, enum: ["mentee", "mentor","admin"] },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    priority:{type:String,enum:['low','medium','high'],default:'medium'},
    isRemove:{type:Boolean,default:false},
    url:{type:String,default:null}
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("notification", notificatoinSchema);
