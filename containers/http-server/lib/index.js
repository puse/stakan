const Koa = require('koa')

const logger = require('koa-logger')

const router = require('./router')

function main (redis) {
  const app = new Koa()

  app.context.redis = redis

  app.use(logger())

  app.use(router())

  return app
}

module.exports = main
