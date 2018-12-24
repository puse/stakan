const composeM = require('koa-compose')

const l2 = require('./l2')

module.exports = () => composeM([
  l2()
])

module.exports.l2 = l2
