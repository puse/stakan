const debug = require('debug')('stakan:connector:bitfinex')

const Bfx = require('bitfinex-api-node')

const R = require('ramda')

const Subscription = require('./subscription')

const C = require('./conversions')

/**
 * Settings
 */

const DEFAULT_OPTIONS = {
  ws: {
    autoReconnect: false,
    seqAudit: true,
    packetWDDelay: 10 * 1000
  }
}

/**
 * Setup
 */

function Source (opts = {}) {
  const settings = R.merge(DEFAULT_OPTIONS, opts)

  const observe = symbol => {
    const bfx = new Bfx(settings)

    const remoteSymbol = C.convertSymbol(symbol)

    return Subscription(bfx.ws(), remoteSymbol)
      .map(C.recoverLevel)
  }

  return { observe }
}

module.exports = Source
