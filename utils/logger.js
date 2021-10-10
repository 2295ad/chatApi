const { createLogger, transports, format } = require('winston');

const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    // new transports.File({
    //   filename: './postData/postData.log',
    //   json: false,
    //   maxsize: 1024000,
    //   maxFiles: 2,
    // }),
    new transports.Console(),
  ]
});

module.exports = {logger};