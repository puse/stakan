const Router = require('koa-router')

function createRouter () {
  const router = new Router()

  return router.routes()
}

module.exports = createRouter
