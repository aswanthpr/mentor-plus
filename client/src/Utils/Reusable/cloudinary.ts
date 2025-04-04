import axios from "axios";

export const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string
}/upload`;

export const UPLOAD_PRESET = import.meta.env
  .VITE_CLOUDINARY_UPLOAD_PRESET as string;

export const uploadFile = async (
  file: File
): Promise<{ url: string; success: boolean }> => {
  if (!file) return { url: "file not exist", success: false };
  if (file.size > 10 * 1024 * 1024)
    return { url: "File size exceeds limit", success: false };

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("public_id", file?.name.split(".")[0]);
  try {
    const response = await axios.post(CLOUDINARY_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const uploadedFileUrl = response?.data?.secure_url;
    return { url: uploadedFileUrl, success: true };
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : String(error));

    return { url: "", success: false };
  }
};
