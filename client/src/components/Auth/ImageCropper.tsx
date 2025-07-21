import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Button from "./Button";

const ImageCropper: React.FC<ImageCroper> = ({
  imageFile,
  onCropComplete,
  onCancel,
}) => {
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  });
  const [imageSrc, setImageSrc] = useState<string>("");
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(imageFile);
    return () => {
      reader.onload = null;
    };
  }, [imageFile]);

  const getCroppedImg = useCallback(
    async (image: HTMLImageElement, crop: PixelCrop): Promise<Blob> => {
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("No 2d context");
      }

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
      return new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            throw new Error("Canvas is empty");
          }
          resolve(blob);
        }, "image/jpeg");
      });
    },
    []
  );

  const handleCropImage = useCallback(async () => {
    if (imageRef.current && crop) {
      const croppedImage = await getCroppedImg(
        imageRef.current,
        crop as PixelCrop
      );
      onCropComplete(croppedImage);
    }
  }, [crop, getCroppedImg, onCropComplete]);

  return (
    <div className="fixed inset- top-10 bottom-9 bg-black bg-opacity-0 flex items-center justify-center p-0 z-10 ">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full">
        <h3 className="text-xl font-bold mb-4 text-center">Crop</h3>
        <div className="w-80 ">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            aspect={1}
            circularCrop
          >
            <img  loading="lazy" ref={imageRef} src={imageSrc} alt="Crop me" />
          </ReactCrop>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="orange" onClick={handleCropImage}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
