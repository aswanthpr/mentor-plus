import fs ,{promises as fsPromise}from "fs";
import path from "path";
import morgan from "morgan";
import { createStream } from "rotating-file-stream";

export const logDirectory = path.join(__dirname, "..", "logs");

// Create the directory if it doesn't exist
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// Generate filenames like access-2025-06-30.log
const generator = (time?: number | Date, index?: number): string => {
  if (!time) return "access.log";
  const date = new Date(time).toISOString().slice(0, 10); // YYYY-MM-DD
  return index ? `access-${date}-${index}.log` : `access-${date}.log`;
};

// Create a rotating write stream for access logs
const accessLogStream = createStream(generator, {
  interval: "1d", // each day create new file for logs
  path: logDirectory, // Store logs in the 'logs' folder inside ',
  size: "10M",
  maxFiles: 5,
  compress: "gzip", // Keep  for a week after that delete
});

fs.readdir(logDirectory, (err, files) => {
  if (err) return;
  const logFiles = files.filter((file) => file.startsWith("access-")).sort();
  const excess = logFiles.length - 5;
  if (excess > 0) {
    const toDelete = logFiles.slice(0, excess);
    toDelete.forEach((file) => {
      fs.unlink(path.join(logDirectory, file), () => {});
    });
  }
});

//  to log to both file and terminal
export const fileLogger = morgan("combined", {
  stream: accessLogStream, // Logs to file
});

export const logErrorToFile = async (err: Error): Promise<void> => {
  try {
    const logFilePath = path.join(logDirectory, "error.log");
    const errorMessage = `${new Date().toISOString()} - ${err.message}\n${
      err.stack
    }\n\n`;

    await fsPromise.appendFile(logFilePath, errorMessage);
  } catch (e) {
    console.error("Failed to write error log:", e);
  }
};
