"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mentorSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    bio: {
        type: String,
        required: true,
        trim: true,
    },
    jobTitle: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    skills: {
        type: [String],
        default: []
    },
    linkedinUrl: {
        type: String,
        default: null,
        trim: true
    },
    githubUrl: {
        type: String,
        default: null,
        trim: true
    },
    profileUrl: {
        type: String,
        default: null,
        trim: true
    },
    resume: {
        type: String,
        required: true
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    verified: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model('mentor', mentorSchema);
