const debug = require('debug')('stakan:source:remote:bitfinex')

const { Observable } = require('rxjs/Rx')

const R = require('ramda')

const { Symbol, Level } = require('./conversions')

const { onceThen } = require('./helpers')

/**
 *
 */

function connect (symbol, client) {
  const remoteSymbol = Symbol.convert(symbol)

  const listen = (observer) => {
    // fns
    const emit = remoteLevel => {
      const level = Level.recover(remoteLevel)
      observer.next(level)
    }

    const report = err => {
      debug('Error: %s', err.message)
      observer.error(err)
    }

    const complete = () => {
      debug('Complete')
      observer.complete()
    }

    // handle extra events
    client
      .on('error', report)
      .on('close', complete)

    // first is batch, flatten
    const emitter = onceThen(R.forEach(emit), emit)

    // subscribe

    client.onOrderBook({ symbol: remoteSymbol }, emitter)
    client.subscribeOrderBook(remoteSymbol)

    // on unsubscribe
    return () => client.close()
  }

  return Observable.create(listen)
}

module.exports = R.curry(connect)
