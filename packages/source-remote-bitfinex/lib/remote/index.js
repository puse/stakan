const debug = require('debug')('stakan:source:remote:bitfinex')

const { Observable } = require('rxjs/Rx')

const R = require('ramda')

const Client = require('./client')

const { onceThen } = require('./helpers')

/**
 *
 */

function observe (client, symbol) {
  const listen = (observer) => {
    const emit = level => observer.next(level)
    // first is batch, flatten
    const emitter = onceThen(R.forEach(emit), emit)

    const report = err => {
      debug('Error: %s', err.message)
      observer.error(err)
    }

    const complete = () => {
      debug('Complete')
      observer.complete()
    }

    // init and go

    client
      .on('error', report)
      .on('close', complete)
      .on('open', () => {
        Client
          .enableSequencing(client)
          .catch(report)

        client.onOrderBook({ symbol }, emitter)
        client.subscribeOrderBook(symbol)
      })

    client.open()

    return () => client.close()
  }

  return Observable.create(listen)
}

/**
 *
 */

function Remote (opts) {
  const client = Client(opts)

  return {
    observe (symbol) {
      return observe(client, symbol)
    }
  }
}

module.exports = Remote
