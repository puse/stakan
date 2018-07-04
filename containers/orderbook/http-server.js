const debug = require('debug')('stakan:http')

const Koa = require('koa')

const getenv = require('getenv')

const logger = require('koa-logger')

const Redis = require('@stakan/redis')

const router = require('@stakan/orderbook-router')

/**
 * Settings
 */

const PORT = getenv.int('NODE_PORT', 8080)

const REDIS_URL = getenv('REDIS_URL', 'redis://localhost:6379')

/**
 * Server setup
 */

const app = new Koa()

app.context.redis = new Redis(REDIS_URL)

app.use(logger())

app.use(router())

app.listen(PORT, _ => {
  debug('Server is listening to %d', PORT)
})
