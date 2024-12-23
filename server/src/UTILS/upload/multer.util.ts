// import multer from 'multer';
// import { Request } from 'express';
// import { v2 as cloudinary } from 'cloudinary';
// import { UploadApiResponse } from 'cloudinary';

// // Memory Storage for Multer
// const storage = multer.memoryStorage();

// // Multer Instance
// const upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     const allowedImageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
//     const allowedDocumentMimeTypes = [
//       'application/pdf',
//       'application/msword',
//       'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//     ];

//     if (
//       (file.fieldname === 'profileImage' && allowedImageMimeTypes.includes(file.mimetype)) ||
//       (file.fieldname === 'cv' && allowedDocumentMimeTypes.includes(file.mimetype))
//     ) {
//       cb(null, true);
//     } else {
//       cb(new Error('Invalid file type for this field.'));
//     }
//   },
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB size limit
// });

// // Cloudinary Upload Function
// const uploadToCloudinary = async (
//   buffer: Buffer,
//   folder: string,
//   publicIdPrefix: string
// ): Promise<UploadApiResponse> => {
//   return await cloudinary.uploader.upload_stream(
//     {
//       folder: folder,
//       public_id: `${publicIdPrefix}-${Date.now()}`,
//       resource_type: 'auto',
//     },
//     (error, result) => {
//       if (error) {
//         throw new Error(error.message);
//       }
//       return result;
//     }
//   ).end(buffer);
// };

// export { upload, uploadToCloudinary };
