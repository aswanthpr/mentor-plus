export const corsOptions = {
  origin: process.env.CLIENT_ORIGIN_URL,
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "X-Access-Token",
    "Authorization",
    "Set-Cookie",
  ],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

