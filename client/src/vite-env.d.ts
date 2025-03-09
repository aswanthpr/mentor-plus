/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_URL: string;
  readonly VITE_CLOUDINARY_CLOUD_NAME:string
  readonly VITE_CLOUDINARY_UPLOAD_PRESET:string
  readonly VITE_STRIPE_PRIVATE_KEY:string
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
