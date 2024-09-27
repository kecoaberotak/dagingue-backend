import pino from 'pino';
import pretty from 'pino-pretty';
import moment from 'moment';

const logger = pino(
  {
    base: {
      pid: false,
    },
    timestamp: () => `,"time":"${moment().format()}"`,
  },
  pretty(),
);

export const logInfo = (message: string) => {
  logger.info(message);
};

export const logError = (message: string, error?: Error) => {
  if (error) {
    logger.error({ error: error.message }, message);
  } else {
    logger.error(message);
  }
};
