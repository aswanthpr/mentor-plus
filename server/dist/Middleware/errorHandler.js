"use strict";
// // ErrorHandler.js
// const ErrorHandler = (err, req, res, next) => {
//     console.log("Middleware Error Hadnling");
//     const errStatus = err.statusCode || 500;
//     const errMsg = err.message || 'Something went wrong';
//     res.status(errStatus).json({
//         success: false,
//         status: errStatus,
//         message: errMsg,
//         stack: process.env.NODE_ENV === 'development' ? err.stack : {}
//     })
// }
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../Config/logger");
// Utility function to log errors (could be extended for file logging)
function logErrorToFile(err) {
    if (!fs_1.default.existsSync(logger_1.logDirectory)) {
        fs_1.default.mkdirSync(logger_1.logDirectory, { recursive: true });
    }
    const logFilePath = path_1.default.join(logger_1.logDirectory, 'error.log');
    const errorMessage = `${new Date().toISOString()} - ${err.message}\n${err.stack}\n\n`;
    fs_1.default.appendFile(logFilePath, errorMessage, (err) => { console.log(err); });
}
// Error handling middleware for all types of errors
function errorHandler(app) {
    app.use((err, req, res) => {
        // Log the error to a file
        logErrorToFile(err);
        // Set default status code if not defined
        const statusCode = err.status || 500;
        const responseMessage = process.env.NODE_ENV === 'development' ? err.stack : 'Internal Server Error';
        // Send the error response to the client
        res.status(statusCode).json({
            message: err.message,
            stack: responseMessage, // Hide stack in production
        });
    });
    // Handle 404 errors (if route not found)
    app.use((req, res, next) => {
        const error = new mongoose_1.Error('Route not found');
        (error).status = 404;
        next(error); // Pass the error to the error handler
    });
}
exports.default = errorHandler;
