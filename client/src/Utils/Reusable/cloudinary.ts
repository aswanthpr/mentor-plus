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
    return { url: "File size exceeds 10MB limit", success: false };

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
    if(uploadedFileUrl){

      return { url: uploadedFileUrl, success: true };

    }else{
       console.error("Upload failed. No secure_url in response:", response?.data);
      return { url: "Upload failed. No URL returned.", success: false };
    }
  } catch (error: unknown) {
    if(axios.isAxiosError(error)){
      if(error?.response){
        const message = error.response.data?.error.message||
        error.response?.statusText ||
        "Unknown cloudinary error";
        console.log("Cloudinary Error:", message);
        return {url:`upload Failed :${message}`,success:false}
     } else if (error.request) {
        console.error("No response from Cloudinary:", error.message);
        return { url: "No response from Cloudinary server", success: false };
      } else {
        console.error("Axios Error:", error.message);
        return { url: `Axios error: ${error.message}`, success: false };
      }
    } else {
      console.error("Unexpected Error:", error);
      return { url: "Unexpected error occurred during upload", success: false };
    }
  }
};
