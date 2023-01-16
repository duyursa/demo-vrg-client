import * as dotenv from 'dotenv'
dotenv.config()

const general = {
  debug: true,
  logger: {
    name: 'winston',
    loggerOpts: {
      level: process.env.LOG_LEVEL || 'debug',
    },
  },
  server: {
    hostname: '0.0.0.0',
    port: parseInt(process.env.PORT) || 2567,
  },
  transportOpts: {
    pingInterval: 5000,
    pingMaxRetries: 3,
  },
  dispatcherOpts: {},
  redis: {
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379/0',
  },
  janusOpts: {
    url: process.env.JANUS_URL || 'ws://localhost:8288',
  },
  webrtc: {
    iceServers: [
      { urls: 'stun:stun.services.mozilla.com' },
      { urls: 'stun:stun.l.google.com:19302' },
      {
        urls: process.env.TURN_URL || 'turn:localhost:3478',
        username: process.env.TURN_USERNAME || 'vrgDev',
        credential: process.env.TURN_CREDENTIAL || 'mirabo@2050',
      },
    ],
  },
  dedicated: {
    ip: process.env.DEDICATED_IP || 'localhost',
    port: process.env.DEDICATED_PORT || '8000',
  },
  api: {
    url: process.env.API_URL || 'http://localhost:3000/api',
    apiKey: process.env.API_KEY,
    jwtSecret: process.env.JWT_SECRET,
  },
}

const dev = {
  ...general,
  transportOpts: {
    pingInterval: 3000,
    pingMaxRetries: 3,
  },
}

const production = {
  ...general,
  debug: false,
}

const config = {
  dev: dev,
  prod: production,
  production: production,
}

const NODE_ENV = process.env.NODE_ENV || 'dev'

export default config[NODE_ENV]
