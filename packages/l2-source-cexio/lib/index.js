const debug = require('debug')('stakan:source:cexio')

const { Observable } = require('rxjs/Rx')

const {
  map
} = require('ramda')

const createPool = require('./pool')

const { subscribe } = require('./remote')

const {
  symbolFrom,
  patchFor,
} = require('./remote/helpers')

const buffer = require('@stakan/rx-l2-buffer')

/**
 * Helpers
 */

/**
 * Setup
 */

const pool = createPool()

/**
 *
 */

function Remote (symbol) {
  const sync = observer => ws => {
    const session = Date.now()
    let offset = null

    const report = message => {
      const err = new Error(message)
      return observer.error(err)
    }

    const publish = data => {
      if (data.id !== offset++) return report('Bad id')

      const payload = patchFor(symbol, session, data)

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
    .pipe(buffer())
}

module.exports = Remote
