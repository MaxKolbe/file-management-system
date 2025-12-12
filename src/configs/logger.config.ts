import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
const { combine, timestamp, json, errors} = winston.format;

const transport: DailyRotateFile = new DailyRotateFile({
  filename: 'fms-%DATE%.log',
  datePattern: 'YYYY-MM-DD', // Log file rotates daily
  maxFiles: '30d', // Log files older than 30 days are deleted
});
 
transport.on('error', (error) => {
  console.log(`There was a tranport error -->  ${error}`);
});

transport.on('rotate', (oldFilename, newFilename) => {
  console.log(`The older file ${oldFilename} has been replaced with ${newFilename}`);
});

const logger = winston.createLogger({
  level: (process.env.LOG_LEVEL as string) || 'info',
  format: combine(errors({ stack: true }), timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }), json()),
  transports: [transport],
});

export default logger;
