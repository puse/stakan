const Bfx = require('bitfinex-api-node')

const Remote = require('./remote')

const { convertSymbol, recoverLevel } = require('./conversions')

/**
 * Setup
 */

function Source (opts = {}) {
  const remote = Remote(opts)

  const observe = symbol => {
    return remote
      .observe(convertSymbol(symbol))
      .map(recoverLevel)
  }

  return {
    observe
  }
}

module.exports = Source
