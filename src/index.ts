import http from 'http'
import express from 'express'
import config from './config'
import { WebSocketTransport } from '@mirabo_colyseus/ws-transport'
import { RedisPresence } from 'colyseus'
import { RedisDriver } from '@colyseus/redis-driver'
import { monitor } from '@colyseus/monitor'

import cors from 'cors'
import { VRGServer } from './VRGServer'

const app = express()
app.use(express.static('src/public'))
app.use(cors())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  next()
})
app.use(express.json())
app.use('/colyseus', monitor())
app.use('/health', (req, res) => {
  res.json({ message: 'success' })
})

app.set('trust proxy', 1);

const server = http.createServer(app)

const presence = new RedisPresence(config.redis)

const vrgServer = new VRGServer({
  driver: new RedisDriver(config.redis),
  transport: new WebSocketTransport({
    server: server,
    ...config.transportOpts,
  }),
  presence: presence,
})

vrgServer.listen(config.server.port, config.server.hostname).then(() => {
  console.log(config)
  console.log(`[VrgServer] Listening on Port: ${config.server.port}`)

  vrgServer.init();
})
