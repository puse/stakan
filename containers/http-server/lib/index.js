const Koa = require('koa')

const logger = require('koa-logger')

const Router = require('./router')

function main (redis) {
  const app = new Koa()

  const router = new Router()

  app.context.redis = redis

  app
    .use(logger())

  app
    .use(router.routes())
    .use(router.allowedMethods())

  return app
}

module.exports = main
