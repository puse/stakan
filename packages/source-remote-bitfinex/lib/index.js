const Bfx = require('bitfinex-api-node')

const { Observable } = require('rxjs/Rx')

const Client = require('./client')

const connect = require('./connector')

/**
 * Setup
 */

function Source (symbol) {
  const observe = () =>
    Observable
      .fromPromise(Client.create())
      .flatMap(connect(symbol))

  return { observe }
}

module.exports = Source
