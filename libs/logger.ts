import pino from 'pino';

// Configure Pino logger with appropriate settings for different environments
const logger = pino({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  ...(process.env.NODE_ENV === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  }),
  // Production configuration - structured JSON logging
  ...(process.env.NODE_ENV === 'production' && {
    formatters: {
      level: (label) => {
        return { level: label };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  }),
});

// Export convenience methods for different log levels
export const log = {
  debug: (message: string, data?: any) => logger.debug(data, message),
  info: (message: string, data?: any) => logger.info(data, message),
  warn: (message: string, data?: any) => logger.warn(data, message),
  error: (message: string, error?: any) => {
    if (error instanceof Error) {
      logger.error({ err: error }, message);
    } else {
      logger.error(error, message);
    }
  },
};

export default logger;