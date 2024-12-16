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
        minlength: [3, "Name must be atleast 3 characters long"]
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
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true
    },
    bio: {
        type: String,
        default: null,
        trim: true,
    },
    skills: {
        type: [String],
        default: []
    },
    profileUrl: {
        type: String,
        default: null,
        trim: true
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    verified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Mentee', menteeSchema);
