import React, { useCallback, useRef, useState } from "react";
import { Camera } from "lucide-react";
import ImageCropper from "./ImageCropper";

export const ProfileImageUpload: React.FC<IProfileImageUpload> = ({
  onImageChange,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showCropper, setShowcropper] = useState<boolean>(false);
  const [selectFile, setSelectFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect =useCallback( (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectFile(file);
      setShowcropper(true);
    }
  },[]);

  const handleCropComplete = useCallback((croppedImage: Blob) => {
    const previewUrl = URL.createObjectURL(croppedImage);
    setPreviewUrl(previewUrl);
    onImageChange(croppedImage);
    setShowcropper(false);
  },[onImageChange]);

  return (
    <>
      <div className="flex justify-center mb-5 ">
        <div className="relative">
          <div
            className="w-28 h-28 rounded-full border-4 border-orange-500 overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera className="w-8 h-8 text-grey-50" />
            )}
          </div>
          <input
            type="file"
            name="profileImage"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
          />
        </div>
      </div>
      {showCropper && selectFile && (
        <ImageCropper
          imageFile={selectFile}
          onCropComplete={handleCropComplete}
          onCancel={() => setShowcropper(false)}
        />
      )}
    </>
  );
};

export default ProfileImageUpload;
