import axios from "axios";

export const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
}/upload`;

export const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadFile = async (file: File): Promise<string> => {
  if (!file) return "file not exist";
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("public_id", file?.name.split(".")[0]);
  try {
    const response = await axios.post(CLOUDINARY_URL, formData);
    const uploadedFileUrl = response.data.secure_url;
    return uploadedFileUrl;
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : String(error));
    return "error";
  }
};
