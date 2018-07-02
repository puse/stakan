const debug = require('debug')('stakan:source:cexio')

const { Observable } = require('rxjs/Rx')

const {
  map
} = require('ramda')

const createPool = require('./pool')

const { subscribe } = require('./remote')

const {
  symbolFrom,
  rowFrom
} = require('./remote/helpers')

/**
 * Helpers
 */

const formatRows = map(rowFrom)

/**
 * Setup
 */

const pool = createPool()

/**
 *
 */

function Remote (symbol) {
  const broker = 'cexio'

  const sync = observer => ws => {
    const session = Date.now()
    let offset = null

    const report = message => {
      const err = new Error(message)
      return observer.error(err)
    }

    const publish = data => {
      if (data.id !== offset++) return report('Bad id')

      const payload = {
        session,
        broker,
        symbol: symbolFrom(data.pair),
        bids: formatRows(data.bids),
        asks: formatRows(data.asks)
      }

      observer.next(payload)
    }

    const reset = data => {
      offset = data.id
      return data
    }

    ws.on('origin:md_update', publish)

    ws.on('close', _ => {
      pool
        .release(ws)
        .then(_ => report('Disconnect'))
    })

    subscribe(ws, symbol)
      .then(reset)
      .then(publish)
  }

  const init = observer => {
    pool
      .acquire()
      .then(sync(observer))
  }

  return new Observable(init)
}

module.exports = Remote
