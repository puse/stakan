const Router = require('koa-router')

const { l2depth } = require('@stakan/orderbook-db-methods')

function read ({ redis } = {}) {
  return async ctx => {
    const db = redis || ctx.redis

    ctx.body = await l2depth(db, ctx.params)
  }
}

function createRouter (opts = {}) {
  const { prefix, redis } = opts

  const router = new Router({ prefix })

  router.get('/:broker/:symbol', read(opts))

  return router.routes()
}

module.exports = createRouter
