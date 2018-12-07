const debug = require('debug')('stakan:source:bitfinex')

const { Observable } = require('rxjs/Rx')

const {
  map
} = require('ramda')

const createPool = require('./pool')

const { subscribe } = require('./remote')

const {
  rowFrom,
  isSnapshot
} = require('./remote/helpers')

/**
 * Setup
 */

const pool = createPool()

/**
 *
 */

function listen (symbol) {
  const broker = 'bitfinex'

  const sync = observer => ws => {
    let session = null

    const report = message => {
      const err = new Error(message)
      return observer.error(err)
    }

    const publish = raw => {
      if (isSnapshot(raw)) {
        session = new Date()
      }

      const rows = isSnapshot(raw)
        ? map(rowFrom, raw)
        : [ rowFrom(raw) ]

      observer.next({
        broker,
        symbol,
        session,
        rows
      })
    }

    ws.on(`origin:re`, (_, data) => {
      publish(data)
    })

    ws.on('close', _ => {
      pool
        .release(ws)
        .then(_ => report('Disconnect'))
    })

    subscribe(ws, symbol)
      .catch(report)
  }

  const init = observer => {
    pool
      .acquire()
      .then(sync(observer))
  }

  return new Observable(init)
}

module.exports = listen
