"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMulterUpload = void 0;
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Create Multer Storage with Cloudinary
const createMulterStorage = (folder, allowedFormats) => {
    const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
        cloudinary: cloudinary_1.v2,
        params: {
            folder: folder, // Specify folder in Cloudinary
            resource_type: "auto", // Automatically determine resource type
            allowed_formats: allowedFormats, // Allowed file formats
        },
    });
    return storage;
};
// Multer upload setup with dynamic storage configuration
const createMulterUpload = (folder, allowedFormats, fileSizeLimit = 10 * 1024 * 1024 // Default size: 10MB
) => {
    const storage = createMulterStorage(folder, allowedFormats);
    const upload = (0, multer_1.default)({
        storage: storage,
        limits: { fileSize: fileSizeLimit }, // Set file size limit
        fileFilter: (req, file, cb) => {
            var _a;
            // Validate file type based on allowed formats
            const fileExtension = (_a = file.originalname.split(".").pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            if (allowedFormats.includes(mimeType)) {
                cb(null, true);
            }
            else {
                cb(new Error(`Invalid file type. Only ${allowedFormats.join(', ')} are allowed.`), false);
            }
        },
    });
    return upload;
};
exports.createMulterUpload = createMulterUpload;
const createMulterUpload = (folder, allowedFormats, fileSizeLimit = 10 * 1024 * 1024 // Default size: 10MB
) => {
    const storage = createMulterStorage(folder, allowedFormats);
    const upload = (0, multer_1.default)({
        storage: storage,
        limits: { fileSize: fileSizeLimit },
        fileFilter: (req, file, cb) => {
            var _a;
            const fileExtension = (_a = file.originalname.split(".").pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            if (fileExtension && allowedFormats.includes(fileExtension)) {
                cb(null, true);
            }
            else {
                cb(new Error(`Invalid file type. Only ${allowedFormats.join(", ")} are allowed.`), false);
            }
        },
    });
    return upload;
};
exports.createMulterUpload = createMulterUpload;
