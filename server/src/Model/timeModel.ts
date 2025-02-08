import mongoose, { Document, Schema } from "mongoose";

export interface slot {
  startTime: string;
  endTime: string;

}
export interface Itime extends Document {
  startDate: Date;
  slots: slot[];
  price: string;
  isBooked?: boolean;
  duration:number;
  mentorId:  mongoose.Schema.Types.ObjectId;
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
          type: String,
          required: true,
        },

        endTime: {
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
      type:mongoose.Types.ObjectId,
      ref: "mentor",
      required: true,
    },
    duration:{
      type:Number,
      required:true,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Itime>("time", timeSchema);

timeSchema.index({ mentorId: 1 });
