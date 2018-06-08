const Router = require('koa-router')

const Store = require('@stakan/store')

function getOne ({ store }) {


  return async ctx => {
    const { params } = ctx

    ctx.body = await store.getOrderBook(params)
  }
}

function createRouter () {
  const router = new Router({
    prefix: '/orderbooks'
  })

  const store = new Store()

  router.get('/:broker/:symbol', getOne({ store }))

  return router.routes()
}

module.exports = createRouter
