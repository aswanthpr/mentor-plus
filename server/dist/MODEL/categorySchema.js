"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const categorySchema = new mongoose_1.default.Schema({
    category: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        minlength: [3, "Name must be atleast 3 characters long"]
    },
    isBlocked: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('categ', categorySchema);
