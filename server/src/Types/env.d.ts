declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    MONGO_URL: string;
    NODE_MAILER_PASS: string;
    NODE_MAILER_EMAIL: string;

    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    ACCESS_TOKEN_EXPIRY: string;
    REFRESH_TOKEN_EXPIRY: string;
    COOKIE_SECRET: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;

    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    CALLBACK_URL: string;

    SESSION_SECRET: string;

    STRIPE_SECRET_KEY: string;

    CLIENT_ORIGIN_URL: string;
    STRIPE_WEBHOOK_WALLET_SECRET: string;
    STRIPE_WEBHOOK_BOOKING_SECRET:string;

    PLATFORM_COMMISION:string;
    MENTOR_COMMISION:string;
    
    NODE_ENV:string

    TURNIX_API_KEY:string
  }
}
