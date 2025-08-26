"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logErrorToFile = exports.fileLogger = exports.logDirectory = void 0;
const fs_1 = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const rotating_file_stream_1 = require("rotating-file-stream");
exports.logDirectory = path_1.default.join(__dirname, "..", "logs");
// Create the directory if it doesn't exist
if (!fs_1.default.existsSync(exports.logDirectory)) {
    fs_1.default.mkdirSync(exports.logDirectory, { recursive: true });
}
// Generate filenames like access-2025-06-30.log
const generator = (time, index) => {
    if (!time)
        return "access.log";
    const date = new Date(time).toISOString().slice(0, 10); // YYYY-MM-DD
    return index ? `access-${date}-${index}.log` : `access-${date}.log`;
};
// Create a rotating write stream for access logs
const accessLogStream = (0, rotating_file_stream_1.createStream)(generator, {
    interval: "1d", // each day create new file for logs
    path: exports.logDirectory, // Store logs in the 'logs' folder inside ',
    size: "10M",
    maxFiles: 5,
    compress: "gzip", // Keep  for a week after that delete
});
fs_1.default.readdir(exports.logDirectory, (err, files) => {
    if (err)
        return;
    const logFiles = files.filter((file) => file.startsWith("access-")).sort();
    const excess = logFiles.length - 5;
    if (excess > 0) {
        const toDelete = logFiles.slice(0, excess);
        toDelete.forEach((file) => {
            fs_1.default.unlink(path_1.default.join(exports.logDirectory, file), () => { });
        });
    }
});
//  to log to both file and terminal
exports.fileLogger = (0, morgan_1.default)("combined", {
    stream: accessLogStream, // Logs to file
});
const logErrorToFile = (err) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const logFilePath = path_1.default.join(exports.logDirectory, "error.log");
        const errorMessage = `${new Date().toISOString()} - ${err.message}\n${err.stack}\n\n`;
        yield fs_1.promises.appendFile(logFilePath, errorMessage);
    }
    catch (e) {
        console.error("Failed to write error log:", e);
    }
});
exports.logErrorToFile = logErrorToFile;
