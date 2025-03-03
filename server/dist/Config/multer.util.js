"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    console.log("File MIME type:", file.mimetype);
    const allowedMimes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/jpg",
        "image/png",
    ];
    if (allowedMimes.includes(file.mimetype)) {
        // File is PDF or DOCX
        return cb(null, true);
    }
    else {
        // Reject file if it is not a PDF or DOCX
        console.log("only PDF and DOCX fiels are allowed ");
        cb(null, false);
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});
exports.default = upload;
