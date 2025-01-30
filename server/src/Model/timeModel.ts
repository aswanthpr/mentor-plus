import mongoose, { Document, Schema } from "mongoose";

export interface slot {
  startTime: Date;
  startStr:string
  endTime: Date;
  endStr:string;
}
export interface Itime extends Document {
  startDate: Date;
  slots: slot[];
  price: string;
  isBooked?: boolean;
  mentorId: mongoose.Schema.Types.ObjectId;
}
export const timeSchema: Schema<Itime> = new Schema(
  {
    startDate: {
      type: Date,
      required: true,
    },
    slots: [
      {
        startTime: {
          type: Date,
          required: true,
        },
        startStr: {
          type: String,
          required: true,
        },
        endTime: {
          type: Date,
          required: true,
        },
        endStr: {
          type: String,
          required: true,
        },
      },
    ],
    price: {
      type: String,
      required: true,
    },
    isBooked: {
      type: Boolean,
      required:true,
      default:false
    },
    mentorId: {
      type:Schema.Types.ObjectId,
      ref: "mentor",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Itime>("time", timeSchema);

timeSchema.index({ mentorId: 1 });
