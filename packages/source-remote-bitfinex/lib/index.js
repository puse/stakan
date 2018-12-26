const Bfx = require('bitfinex-api-node')

const Remote = require('./remote')

const { Symbol, Level } = require('./types')

/**
 * Setup
 */

function Source (opts = {}) {
  const remote = Remote(opts)

  //
  const observe = x => {
    const symbol = Symbol.fromString(x)

    return remote
      .observe(symbol.toString('bitfinex'))
      .map(Level.fromBitfinex)
  }

  return { observe }
}

module.exports = Source
