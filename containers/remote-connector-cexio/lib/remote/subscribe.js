const debug = require('debug')('stakan:connector:cexio')

const send = require('./send')

const { symbolToPair } = require('./helpers')

const CHANNEL = 'order-book-subscribe'

function subscribe (ws, symbol, depth = 15) {
  debug('Subscribing to %s', symbol)

  const pair = symbolToPair(symbol)

  const payload = {
    e: CHANNEL,
    data: {
      pair,
      depth,
      subscribe: true
    }
  }

  return send(ws, payload, true)
}

module.exports = subscribe
