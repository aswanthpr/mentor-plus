"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const menteeSchema = new mongoose_1.default.Schema({
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
        enum: ["google", "email"],
        required: [true, "Provider is required"],
        default: "email",
    },
}, { timestamps: true });
menteeSchema.index({ phone: 1 }, { unique: true, partialFilterExpression: { phone: { $ne: null } } });
exports.default = mongoose_1.default.model("mentee", menteeSchema);
