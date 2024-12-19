export  const corsOptions = {
    origin:'http://localhost:5173',
    credentials:true,
    methods:'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    allowedHeaders:[
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'X-Access-Token',
        'Authorization',
        'Set-Cookie',
        'Access-Control-Allow-Credentials',
    ],
    preflightContinue:false,
    optionsSuccessStatus:200,
}