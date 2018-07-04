const Router = require('koa-router')

const { obdepth } = require('@stakan/orderbook-db-methods')

function read ({ redis } = {}) {
  return async ctx => {
    const db = redis || ctx.redis

    ctx.body = await obdepth(db, ctx.params)
  }
}

function createRouter (opts) {
  const router = new Router({
    prefix: '/orderbooks'
  })

  router.get('/:broker/:symbol', read(opts))

  return router.routes()
}

module.exports = createRouter
