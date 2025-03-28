"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logErrorToFile = exports.fileLogger = exports.logDirectory = void 0;
const morgan_1 = __importDefault(require("morgan"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const rotating_file_stream_1 = require("rotating-file-stream");
exports.logDirectory = path_1.default.join(__dirname, '..', 'logs');
// Create the directory if it doesn't exist
if (!fs_1.default.existsSync(exports.logDirectory)) {
    fs_1.default.mkdirSync(exports.logDirectory, { recursive: true });
}
// Create a rotating write stream for access logs
const accessLogStream = (0, rotating_file_stream_1.createStream)('access.log', {
    interval: '1d', // each day create new file for logs
    path: exports.logDirectory, // Store logs in the 'logs' folder inside 'src'
    maxFiles: 7, // Keep  for a week after that delete 
});
//  to log to both file and terminal 
exports.fileLogger = (0, morgan_1.default)('combined', {
    stream: accessLogStream // Logs to file
});
const logErrorToFile = (err) => {
    if (!fs_1.default.existsSync(exports.logDirectory)) {
        fs_1.default.mkdirSync(exports.logDirectory, { recursive: true });
    }
    const logFilePath = path_1.default.join(exports.logDirectory, 'error.log');
    const errorMessage = `${new Date().toISOString()} - ${err.message}\n${err.stack}\n\n`;
    fs_1.default.appendFile(logFilePath, errorMessage, (err) => { console.log(err); });
};
exports.logErrorToFile = logErrorToFile;
