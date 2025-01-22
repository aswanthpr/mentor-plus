import mongoose, { Schema, Document } from "mongoose";

export interface Imentee extends Document {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  bio?: string | null;
  isBlocked: boolean;
  profileUrl?: string;
  linkedinUrl: string; 
  githubUrl: string;
  education: string;
  currentPosition: string;
  verified?: boolean;
  isAdmin: boolean;
  provider: string;
}

const menteeSchema: Schema<Imentee> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be atleast 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      default: null,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
      default: null,
    },
    bio: {
      type: String,
      default: null,
      trim: true,
    },
    profileUrl: {
      type: String,
      default: null,
      trim: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    linkedinUrl: {
      type: String,
      default: null,
    },
    githubUrl: {
      type: String,
      default: null,
    },
    education: {
      type: String,
      default: "",
    },
    currentPosition: {
      type: String,
      default: "",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: String,
      enum: ["google","email"],
      required: [true, "Provider is required"],
      default: "email",
    },
  },
  { timestamps: true }
);

menteeSchema.index(
  { phone: 1 },
  { unique: true, partialFilterExpression: { phone: { $ne: null } } }
);

export default mongoose.model<Imentee>("mentee", menteeSchema);
