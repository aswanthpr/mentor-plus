export  const corsOptions = {
    allowedHeaders:[
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'X-Access-Token',
        'Authorization'

    ],
    credentials:true,
    origin:'http://localhost:5173',
    methods:'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    preflightContinue:false,
    optionsSuccessStatus:200,
}