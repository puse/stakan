const Router = require('koa-router')

const Redis = require('@stakan/redis')

const { obdepth } = require('@stakan/orderbook-db-methods')

function read ({ store }) {
  return async ctx => {
    const { params } = ctx

    ctx.body = await obdepth(store, ctx.params)
    // const { broker, symbol } = ctx.params
    // const topic = `${broker}/${symbol}`
    //
    // ctx.body = await store.obdepth(topic)
  }
}

function createRouter () {
  const router = new Router({
    prefix: '/orderbooks'
  })

  const store = new Redis()

  router.get('/:broker/:symbol', read({ store }))

  return router.routes()
}

module.exports = createRouter
