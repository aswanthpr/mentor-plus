import  morgan from 'morgan';
import  fs from 'fs';
import  path from 'path';
import {createStream} from 'rotating-file-stream';


export const logDirectory = path.join(__dirname, '..','logs');

// Create the directory if it doesn't exist
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// Create a rotating write stream for access logs
const accessLogStream = createStream('access.log', {
  interval: '1d',       // each day create new file for logs
  path: logDirectory,   // Store logs in the 'logs' folder inside 'src'
  maxFiles: 7,          // Keep  for a week after that delete 
});

//  to log to both file and terminal 
export const fileLogger = morgan('combined', {
  stream: accessLogStream // Logs to file
});

  
export const  logErrorToFile = (err : Error): void => {

  // if (!fs.existsSync(logDirectory)) {
  //   fs.mkdirSync(logDirectory, { recursive: true });
  // }

  const logFilePath = path.join(logDirectory, 'error.log');
  const errorMessage = `${new Date().toISOString()} - ${err.message}\n${err.stack}\n\n`;

  fs.appendFile(logFilePath, errorMessage, (err)=>{console.log(err)});
}


 