const debug = require('debug')('stakan:source:bitfinex')

const { whereEq } = require('ramda')

const send = require('./send')

const {
  symbolToPair,
  symbolFrom
} = require('./helpers')

const EVENT = 'subscribe'
const CHANNEL = 'book'

function subscribe (ws, symbol) {
  debug('Subscribing to %s', symbol)

  const pair = symbolToPair(symbol)

  const payload = {
    event: EVENT,
    channel: CHANNEL,
    symbol: pair
  }

  const isSame = whereEq({
    channel: CHANNEL,
    symbol: pair
  })

  const run = (resolve, reject) => {
    ws.on('origin:error', err => {
      if (isSame(err)) reject(err.msg)
    })

    ws.on('origin:subscribed', data => {
      if (isSame(data)) resolve(data)
    })

    return send(ws, payload, true)
  }

  return new Promise(run)
}

module.exports = subscribe
