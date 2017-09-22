import winston from 'winston';

const loggingEnabled = JSON.parse(process.env.LOGGING_ENABLED || true);

class Logger {
  constructor() {
    this.logger = new (winston.Logger)({
      exitOnError: false,

      transports: [
        new (winston.transports.Console)({
          level: process.env.loglevel,
          json: true,
          stringify: true,
          prettyPrint: true,
          colorize: true,
          silent: false,
          timestamp: false,
          handleExceptions: true,
          humanReadableUnhandledException: true,
        }),
      ],
    });
  }

  log(level, logRecord, metadata) {
    if (loggingEnabled) {
      this.logger.log(level, logRecord, metadata);
    }
  }

  error(error, metadata) {
    this.log('error', error, metadata);
  }

  warn(warning, metadata) {
    this.log('warning', warning, metadata);
  }

  info(info, metadata) {
    this.log('info', info, metadata);
  }
}

export default new Logger();
