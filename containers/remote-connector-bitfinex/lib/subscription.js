const debug = require('debug')('stakan:connector:bitfinex')

const R = require('ramda')

const { Observable } = require('rxjs/Rx')

const Bfx = require('bitfinex-api-node')

const { onceThen } = require('./helpers')

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
 * Helpers
 */

/**
 * WS helpers
 */

const enableSequencing = (ws) => {
  const confirmSequencing = () => {
    if (!ws.isFlagEnabled(65536)) {
      const err = new Error('seq enable succeeded, but flag not updated')
      return Promise.reject(err)
    }

    debug('sequencing enabled')
    return Promise.resolve()
  }

  return ws
    .enableSequencing({ audit: true })
    .then(confirmSequencing)
}


const subscribeOrderBook = (ws, symbol, emit) => {
  const emitEach = xs => xs.forEach(emit)

  ws.onOrderBook({ symbol }, onceThen(emitEach, emit))
  ws.subscribeOrderBook(symbol)
}

/**
 *
 */

function main (opts, symbol) {
  const settings = R.merge(DEFAULT_OPTIONS, opts)

  const bfx = new Bfx(settings)

  const listen = observer => {
    const emit = level => observer.next(level)

    const report = err => {
      debug('Error: %s', err.message)
      observer.error(err)
    }

    const complete = () => {
      debug('Complete')
      observer.complete()
    }

    // init and go

    const ws = bfx.ws()

    ws.on('error', report)
      .on('close', complete)
      .on('open', () => {
        enableSequencing(ws).catch(report)
        subscribeOrderBook(ws, symbol, emit)
      })

    ws.open()

    return () => ws.close()
  }

  return Observable.create(listen)
}

module.exports = R.curry(main)
