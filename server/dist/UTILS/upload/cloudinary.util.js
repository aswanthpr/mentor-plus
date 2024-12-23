"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import multer from "multer";
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
exports.default = cloudinary_1.v2;
// Create Multer Storage with Cloudinary
// const createMulterStorage = (folder: string, allowedFormats: string[]) => {
//   const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//       folder: folder, // Specify folder in Cloudinary
//       resource_type: "auto", // Automatically determine resource type
//       allowed_formats: allowedFormats, // Allowed file formats
//     },
//   });
//   return storage;
// };
//   // Multer upload setup with dynamic storage configuration
// const createMulterUpload = (
//     folder: string,
//     allowedFormats: string[],
//     fileSizeLimit: number = 10 * 1024 * 1024  // Default size: 10MB
//   ) => {
//     const storage = createMulterStorage(folder, allowedFormats);
//     const upload = multer({
//       storage: storage,
//       limits: { fileSize: fileSizeLimit },  // Set file size limit
//       fileFilter: (req: any, file: any, cb: any) => {
//         // Validate file type based on allowed formats
//         const fileExtension = file.originalname.split(".").pop()?.toLowerCase();
//         if (fileExtension&&allowedFormats.includes(fileExtension)) {
//           cb(null, true);
//         } else {
//           cb(new Error(`Invalid file type. Only ${allowedFormats.join(', ')} are allowed.`), false);
//         }
//       },
//     });
//     return upload;
//   };
