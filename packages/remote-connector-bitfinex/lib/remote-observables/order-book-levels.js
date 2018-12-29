const debug = require('debug')('stakan:remote:connector:bitfinex')

const { Observable } = require('rxjs/Rx')

const R = require('ramda')

const { onceThen } = require('../helpers')

/**
 * Helpers
 */

const apiFrom = observer => {
  const next = data => observer.next(data)

  return {
    next: onceThen(R.forEach(next), next), // flatten inital batch
    error: observer.error.bind(observer),
    complete: observer.complete.bind(observer)
  }
}

/**
 *
 */

function observe (client, symbol) {
  const cbGID = Date.now()

  const connect = api => {
    client
      .on('error', api.error)
      .on('close', api.complete)

    client.onOrderBook({ symbol, cbGID }, api.next)

    // subscribe
    debug('Subscribe to orderbook %s', symbol)
    client.subscribeOrderBook(symbol)
  }

  const disconnect = api => {
    client
      .removeListener('error', api.error)
      .removeListener('close', api.complete)

    client.removeListeners(cbGID)

    debug('Unsubscribe from orderbook %s', symbol)
    client.unsubscribeOrderBook(symbol)
  }

  const listen = (observer) => {
    const api = apiFrom(observer)

    connect(api)
    // handle extra events

    return () => disconnect(api)
  }

  return Observable.create(listen)
}

module.exports = R.curry(observe)
