import mongoose, { Document, Schema } from "mongoose";

export interface IslotSchedule extends Document {
  menteeId: mongoose.Schema.Types.ObjectId;
  status: string;
  slotId: mongoose.Schema.Types.ObjectId;
  isExpired?: boolean;
  paymentStatus: string;
  paymentMethod: string;
  paymentAmount: string;
  paymentTime: string;
  duration: string;
  sessionCode?: string | null;
  description: string;
  cancelReason:string|null
}

const slotScheduleSchema: Schema<IslotSchedule> = new Schema(
  {
    menteeId: {
      type: mongoose.Types.ObjectId,
      ref: "mentee",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: [
        "RESCHEDULED",
        "CANCELLED",
        "PENDING",
        "CONFIRMED",
        "COMPLETED",
        "RECLAIM_REQUESTED",
        "REJECTED"
      ],
      default: "PENDING",
    },
    slotId: {
      type: mongoose.Types.ObjectId,
      ref: "time",
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      required: true,
    },
    isExpired: {
      type: Boolean,
      default: false,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    paymentAmount: {
      type: String,
      required: true,
    },
    paymentTime: {
      type: String,
      required: true,
      default: null,
    },
    description: {
      type: String,
      required: true,
    },
    sessionCode: {
      type: String,
      default: null,
    },

    cancelReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("slotBooking", slotScheduleSchema);
