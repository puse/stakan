const debug = require('debug')('stakan:http')

const Koa = require('koa')

const getenv = require('getenv')

const logger = require('koa-logger')

const router = require('@stakan/orderbook-router')

/**
 * Settings
 */

const PORT = getenv.int('NODE_PORT', 8080)

/**
 * Server setup
 */

const app = new Koa()

app.use(logger())

app.use(router())

app.listen(PORT, _ => {
  debug('Server is listening to %d', PORT)
})
