import { v2 as cloudinary, UploadApiResponse } from "cloudinary";


if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error('Cloudinary configuration is missing');
}
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});
//configuration for image upload in cloudinary
//input file buffer => cloudinary url;
export const uploadImage = (imageBuffer: Buffer | undefined): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "profiles" },
      (error: unknown, result: UploadApiResponse | undefined) => {
        if (error) {
          return reject(new Error(`Failed to upload image: ${error instanceof Error ? error.message : String(error)}`));
        }
        if (!result) {
          return reject(new Error('Failed to get result from Cloudinary'));
        }
        resolve(result.secure_url);
      }
    );
    uploadStream.end(imageBuffer);
  });
};

//configuration for document  upload in cloudinary
//input file buffer => cloudinary url;
export const uploadFile = (fileBuffer: Buffer | undefined, fileName: string | undefined): Promise<string> => {
  return new Promise((resolve, reject) => {

    const uploadStream = cloudinary.uploader.upload_stream({
      folder: 'documents',
      resource_type: 'raw',
      public_id: `${Date.now()}-${fileName ? fileName : "doc"}`
    },
      (error: unknown, result: UploadApiResponse | undefined) => {
        if (error) {
          return reject(new Error(`Failed to upload file: ${error instanceof Error ? error.message : String(error)}`));
        }
        if (!result) {
          return reject(new Error('Failed to get result from Cloudinary'));
        }
        resolve(result.secure_url);

      }
    );
    uploadStream.end(fileBuffer)
    //file upload is happening in the form of writable stream 
    // here ending the stream to confirm the process is complete
  })
}

