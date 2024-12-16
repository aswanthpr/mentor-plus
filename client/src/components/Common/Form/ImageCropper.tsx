import React,{useState,useRef, useEffect} from 'react';
import ReactCrop,{Crop,PixelCrop} from 'react-image-crop';
import "react-image-crop/dist/ReactCrop.css"
import Button from './Button';

interface IImageCroper{
  imageFile:File;
  onCropComplete:(croppedImage:Blob)=>void;
  onCancel:()=>void
}

const ImageCropper:React.FC<IImageCroper> = ({imageFile,onCropComplete,onCancel}) => {

  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    x: 25,
    y: 25,
    width: 50,
    height: 50
  });
  const [imageSrc,setImageSrc] = useState<string>('');
  const imageRef =useRef<HTMLImageElement>(null);


  useEffect(()=>{
    const reader = new FileReader();
    reader.onload =()=>{
      setImageSrc(reader.result as string)
    };
    reader.readAsDataURL(imageFile);
    return ()=>{
      reader.onload = null;
    }
  },[imageFile])

  const getCroppedImg = async (image:HTMLImageElement,crop:PixelCrop):Promise<Blob> =>{
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
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
          throw new Error('Canvas is empty');
        }
        resolve(blob);
      }, 'image/jpeg');
    });
  }

   const handleCropImage= async ()=>{
    if(imageRef.current && crop){
      const croppedImage = await getCroppedImg(imageRef.current,crop as PixelCrop);
      onCropComplete(croppedImage)
    }
   }
  return (
    <div className='flexd inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-lg p-6 max-w-2xl w-full'>

        <h3 className='text-xl font-bold mb-4 '>Crop Profile Image</h3>
          <div className='mb-4 '>
            <ReactCrop 
            crop={crop}
            onChange={(c)=>setCrop(c)}
            aspect={1}
            circularCrop
            >
              <img ref={imageRef} src={imageSrc} alt="Crop me" />
            </ReactCrop>
          </div>
          <div className='flex justify-end gap-2 '>
            <Button 
            variant='secondary'
            onClick={onCancel}
            >Cancel
            </Button>
            <Button
            variant='orange'
            onClick={handleCropImage}
            >Save
            </Button>
          </div>
      </div>
    </div>
  )
}

export default ImageCropper