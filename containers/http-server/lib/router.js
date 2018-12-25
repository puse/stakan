const Router = require('koa-router')

const { l2depth } = require('@stakan/db-methods')

function read () {
  return async ctx => {
    ctx.body = await l2depth(ctx.redis, ctx.params)
  }
}

function main () {
  const router = new Router()

  router.get('/:broker/:symbol', read())

  return router
}

module.exports = main
