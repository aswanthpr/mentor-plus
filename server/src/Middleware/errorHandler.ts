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

// import { NextFunction } from "express";

// // export default ErrorHandler
// // Error handling middleware for all types of errors
// function errorHandler(app) {
//     app.use((err, req, res, next) => {
//       // Log the error to a file
//     //   logErrorToFile(err);
  
//       // Set default status code if not defined
//       const statusCode = err.status || 500;
//       const responseMessage = process.env.NODE_ENV === 'development' ? err.stack : 'Internal Server Error';
  
//       // Send the error response to the client
//       res.status(statusCode).json({
//         message: err.message,
//         stack: responseMessage, // Hide stack in production
//       });
//     });
  
//     // Handle 404 errors (if route not found)
//     app.use((req:Request, res:Response, next:NextFunction) => {
//       const error = new Error('Route not found');
//       (error as any).status = 404;
//       next(error); // Pass the error to the error handler
//     });
//   }
  


import express,{ Request, Response, NextFunction} from 'express';
import { Error } from 'mongoose';
import fs from 'fs';
import path from 'path';
import { logDirectory } from '../Config/logger';

// Custom Error interface extending the built-in Error
interface CustomError extends Error {
    status?: number; // Optional status property
  }
  
// Utility function to log errors (could be extended for file logging)
function logErrorToFile(err : Error): void {

  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
  }

  const logFilePath = path.join(logDirectory, 'error.log');
  const errorMessage = `${new Date().toISOString()} - ${err.message}\n${err.stack}\n\n`;

  fs.appendFile(logFilePath, errorMessage, (err)=>{console.log(err)});
}
// Error handling middleware for all types of errors
function errorHandler(app: express.Application): void {
    app.use((err: CustomError, req: Request, res: Response): void => {
      // Log the error to a file
      logErrorToFile(err);
  
      // Set default status code if not defined
      const statusCode = err.status|| 500;
      const responseMessage = process.env.NODE_ENV === 'development' ? err.stack : 'Internal Server Error';
  
      // Send the error response to the client
      res.status(statusCode).json({
        message: err.message,
        stack: responseMessage, // Hide stack in production
      });
    });
  
    // Handle 404 errors (if route not found)
    app.use((req: Request, res: Response, next: NextFunction): void => {
      const error:CustomError = new Error('Route not found');
      (error).status = 404;
      next(error); // Pass the error to the error handler
    });
  }
  
  export default errorHandler;