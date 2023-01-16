import winston from 'winston'
import log4j from 'log4js'
import config from '../config'

export interface Logger {
  trace(message?: any, ...params: any[]): void
  debug(message?: any, ...params: any[]): void
  info(message?: any, ...params: any[]): void
  warn(message?: any, ...params: any[]): void
  error(message?: any, ...params: any[]): void
}

class WinstonLogger implements Logger {
  module: string
  logger: winston.Logger

  constructor(module?: string) {
    this.module = module || 'default'
    this.logger = winston.createLogger({
      ...config.logger.loggerOpts,
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: config.debug ? true : false }),
        winston.format.colorize(),
        winston.format.prettyPrint(),
        winston.format.splat(),
        winston.format.printf(log => {
          if (log instanceof Error) {
            return `[${log.timestamp}] [${log.level}] [${this.module}] - ${log.message} ${log.stack}`
          } else {
            return `[${log.timestamp}] [${log.level}] [${this.module}] - ${log.message}`
          }
        })
      ),
      timestamp: true,
      defaultMeta: { service: 'vrg' },
      transports: [new winston.transports.Console()],
    })
  }

  trace(message?: any, ...params: any[]): void {
    this.logger.silly(message, ...params)
  }

  debug(message?: any, ...params: any[]): void {
    this.logger.debug(message, ...params)
  }

  info(message?: any, ...params: any[]): void {
    this.logger.info(message, ...params)
  }

  warn(message?: any, ...params: any[]): void {
    this.logger.warn(message, ...params)
  }

  error(message?: any, ...params: any[]): void {
    this.logger.error(message, ...params)
  }
}

class Log4jsLogger implements Logger {
  logger: log4j.Logger

  constructor(module?: string) {
    this.logger = log4j.getLogger(module || 'default')
    this.logger.level = config.logger.loggerOpts.level || 'debug'
  }

  trace(message?: any, ...params: any[]): void {
    this.logger.trace(message, ...params)
  }

  debug(message?: any, ...params: any[]): void {
    this.logger.debug(message, ...params)
  }

  info(message?: any, ...params: any[]): void {
    this.logger.info(message, ...params)
  }

  warn(message?: any, ...params: any[]): void {
    this.logger.warn(message, ...params)
  }

  error(message?: any, ...params: any[]): void {
    this.logger.error(message, ...params)
  }
}

export function getLogger(module?: string): Logger {
  if (config.logger.name != 'winston') {
    return new WinstonLogger(module)
  } else {
    return new Log4jsLogger(module)
  }
}
