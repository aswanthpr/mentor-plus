"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = exports.uploadImage = void 0;
const cloudinary_1 = require("cloudinary");
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary configuration is missing');
}
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadImage = (imageBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({ folder: "profiles" }, (error, result) => {
            if (error) {
                return reject(new Error(`Failed to upload image: ${error instanceof Error ? error.message : String(error)}`));
            }
            if (!result) {
                return reject(new Error('Failed to get result from Cloudinary'));
            }
            resolve(result.secure_url);
        });
        uploadStream.end(imageBuffer);
    });
};
exports.uploadImage = uploadImage;
const uploadFile = (fileBuffer, fileName) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder: 'documents',
            resource_type: 'raw',
            public_id: `${Date.now()}-${fileName ? fileName : "doc"}`
        }, (error, result) => {
            if (error) {
                return reject(new Error(`Failed to upload file: ${error instanceof Error ? error.message : String(error)}`));
            }
            if (!result) {
                return reject(new Error('Failed to get result from Cloudinary'));
            }
            resolve(result.secure_url);
        });
        uploadStream.end(fileBuffer);
    });
};
exports.uploadFile = uploadFile;
