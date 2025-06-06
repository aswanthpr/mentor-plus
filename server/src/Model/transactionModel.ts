import mongoose, { Schema, model, Document } from "mongoose";
// export  type transaction_type = "deposit"|"withdrawal"|"earning"|"Paid"|"Receive";
export interface Itransaction extends Document {
  transactionType: string;
  amount: number;
  note: string;
  walletId: mongoose.Schema.Types.ObjectId;
  status: string;
  createdA?: Date;
  updatedAt?: Date;
}

const transactionSchema: Schema<Itransaction> = new Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    walletId: {
      type: mongoose.Types.ObjectId,
      ref: "wallet",
      required: true,
    },
    transactionType: {
      type: String,
      enum: ["credit", "debit","paid"],
      required: true,
      default: "paid",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      required:true,
      default:"pending"
    },
    note:{
      type:String,
      required:true,

    }
  },
  {
    timestamps: true,
  }
);

export default model<Itransaction>("transaction", transactionSchema);
