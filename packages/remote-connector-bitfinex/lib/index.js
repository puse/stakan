const Bfx = require('bitfinex-api-node')

const { Observable } = require('rxjs/Rx')

const {
  map,
  flatMap,
  finalize
} = require('rxjs/operators')

const R = require('ramda')

const Pool = require('./pool')

const { OrderBookLevels } = require('./remote-observables')

const { Symbol, Level } = require('./conversions')

/**
 * Helpers
 */


/**
 * Remote
 */

function Remote (config) {
  if (!R.is(Remote, this)) return new Remote(config)

  const pool = Pool(config)

  this.acquire = () => {
    return pool.acquire()
  }

  this.release = (client) => {
    return pool.release(client)
  }

  this.tearDown = () => {
    return pool
      .drain()
      .then(() => pool.clear())
  }

  return this
}

/**
 * Subscribe to OrderBook changes feed
 *
 * @param {String} symbol
 * @returns {Observable}
 */

Remote.prototype.observeOrderBookLevels = function (symbol) {
  const { acquire, release } = this

  const observeLevels = client => {
    const remoteSymbol = Symbol.convert(symbol)
    return OrderBookLevels(client, remoteSymbol)
  }

  const promisedConnection = acquire()

  const tearDown = () => {
    Promise
      .resolve(promisedConnection)
      .then(release)
  }

  return Observable
    .fromPromise(promisedConnection)
    .pipe(
      flatMap(observeLevels),
      map(Level.recover),
      finalize(tearDown)
    )
}

module.exports = Remote
