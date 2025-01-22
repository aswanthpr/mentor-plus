// import  morgan from 'morgan';
// import  fs from 'fs';
// import  path from 'path';
// import  rfs from 'rotating-file-stream';

// // Define the log directory inside the 'src' folder
// const logDirectory = path.join(__dirname, 'src', 'logs');

// // Create the directory if it doesn't exist
// if (!fs.existsSync(logDirectory)) {
//   fs.mkdirSync(logDirectory, { recursive: true });
// }

// // Create a rotating write stream for access logs
// const accessLogStream = rfs.createStream('access.log', {
//   interval: '1d',       // Rotate logs daily
//   path: logDirectory,   // Store logs in the 'logs' folder inside 'src'
//   maxFiles: 7,          // Keep 7 log files (for a week)
// });

// // Create a rotating write stream for error logs
// const errorLogStream = rfs.createStream('error.log', {
//   interval: '1d',       // Rotate logs daily
//   path: logDirectory,   // Store logs in the 'logs' folder inside 'src'
//   maxFiles: 7,          // Keep 7 log files (for a week)
// });

// // Create a morgan logger that logs to both console and file
// const accessLogger = morgan('combined', {
//   stream: process.stdout  // Logs to terminal (console)
// });

// // Configure morgan to log to both file and terminal (stdout)
// const fileLogger = morgan('combined', {
//   stream: accessLogStream // Logs to file
// });

// // Error logging middleware for Express (will log error to file)
// const errorLogger = (err, req, res, next) => {
//   console.error(err); // Log error to console for debugging

//   // Write error to file
//   const errorMessage = `${new Date().toISOString()} - ${err.message}\n${err.stack}\n\n`;
//   fs.appendFileSync(path.join(logDirectory, 'error.log'), errorMessage);

//   // Pass error to next middleware (usually error handler)
//   next(err);
// };

// module.exports = {
//   accessLogger,
//   fileLogger,
//   errorLogger
// };
