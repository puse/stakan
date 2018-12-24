const Router = require('koa-router')

const composeM = require('koa-compose')

const { l2depth } = require('@stakan/db-methods')

function read () {
  return async ctx => {
    ctx.body = await l2depth(ctx.redis, ctx.params)
  }
}

function main () {
  const router = new Router({ prefix: '/l2' })

  router.get('/:broker/:symbol', read())

  return composeM([
    router.routes(),
    router.allowedMethods()
  ])
}

module.exports = main
