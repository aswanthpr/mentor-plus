declare namespace NodeJS{
    interface ProcessEnv{
          PORT:string
           MONGO_URL:string
           NODE_MAILER_PASS:string
           NODE_MAILER_EMAIL:string

           JWT_ACCESS_SECRET:string
           JWT_REFRESH_SECRET:string
           ACCESS_TOKEN_EXPIRY:string
           REFRESH_TOKEN_EXPIRY:string
           COOKIE_SECRET:string
    }
}