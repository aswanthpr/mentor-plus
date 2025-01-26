import  morgan from 'morgan';
import  fs from 'fs';
import  path from 'path';
import {createStream} from 'rotating-file-stream';


// Define the log directory inside the 'src' folder
export const logDirectory = path.join(__dirname, '..','logs');

// Create the directory if it doesn't exist
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// Create a rotating write stream for access logs
const accessLogStream = createStream('access.log', {
  interval: '1d',       // each day create new file for logs
  path: logDirectory,   // Store logs in the 'logs' folder inside 'src'
  maxFiles: 7,          // Keep 7 log files (for a week) after that delete each files
});

// Configure morgan to log to both file and terminal 
export const fileLogger = morgan('combined', {
  stream: accessLogStream // Logs to file
});

// // Error logging middleware for Express (will log error to file)
// export const errorLogger = (err:Error, req:Request, res:Response, next:NextFunction) => {
//   console.error(err); // Log error to console for debugging

//   // Write error to file using the errorLogStream
//   const errorMessage = `${new Date().toISOString()} - ${err.message}\n${err.stack}\n\n`;
//   fs.appendFile(path.join(logDirectory, 'error.log'), errorMessage,(err)=>{console.error(err)});

//   // Pass error to next middleware (usually error handler)
//   next(err);
// };


 