const Router = require('koa-router')

const OrderbookDB = require('@stakan/orderbook-db')

function read ({ store }) {

  return async ctx => {
    const { params } = ctx

    const { broker, symbol } = ctx.params
    const topic = `${broker}/${symbol}`

    ctx.body = await store.obdepth(topic)
  }
}

function createRouter () {
  const router = new Router({
    prefix: '/orderbooks'
  })

  const store = new OrderbookDB()

  router.get('/:broker/:symbol', read({ store }))

  return router.routes()
}

module.exports = createRouter
