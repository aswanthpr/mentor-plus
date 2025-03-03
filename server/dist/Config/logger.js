"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileLogger = exports.logDirectory = void 0;
const morgan_1 = __importDefault(require("morgan"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const rotating_file_stream_1 = require("rotating-file-stream");
// Define the log directory inside the 'src' folder
exports.logDirectory = path_1.default.join(__dirname, '..', 'logs');
// Create the directory if it doesn't exist
if (!fs_1.default.existsSync(exports.logDirectory)) {
    fs_1.default.mkdirSync(exports.logDirectory, { recursive: true });
}
// Create a rotating write stream for access logs
const accessLogStream = (0, rotating_file_stream_1.createStream)('access.log', {
    interval: '1d', // each day create new file for logs
    path: exports.logDirectory, // Store logs in the 'logs' folder inside 'src'
    maxFiles: 7, // Keep 7 log files (for a week) after that delete each files
});
// Configure morgan to log to both file and terminal 
exports.fileLogger = (0, morgan_1.default)('combined', {
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
