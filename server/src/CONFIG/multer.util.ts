import multer, { StorageEngine } from 'multer';


const storage:StorageEngine = multer.memoryStorage();
 


const fileFilter = (req:Express.Request,file:Express.Multer.File,cb:multer.FileFilterCallback)=>{
    console.log('File MIME type:', file.mimetype);
    const allowedMimes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg','image/jpg', 'image/png'];
    if(allowedMimes.includes(file.mimetype)){
 // File is PDF or DOCX
 return cb(null,true)
    }else{
        // Reject file if it is not a PDF or DOCX
        let  errors:Error= new Error("only PDF and DOCX fiels are allowed ")
        cb(null, false); 
    }
}

 const upload = multer({
    storage,
    fileFilter,
    limits:{fileSize:5*1024*1024}});
export  default upload  
