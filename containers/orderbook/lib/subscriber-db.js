const debug = require('debug')('stakan:l2:db')

const { Subscriber } = require('rxjs/Rx')

const {
  l2add,
  l2commit
} = require('@stakan/db-methods')

/**
 * Ingest patches
 *
 * @param {Redis} db
 *
 * @return {Rx.Subscriber}
 */

/**
 * TODO: handle db connection
 */

function Sink (db) {
  debug('Initialize DB subscriber')

  const next = patch => {
    const commit = _ => {
      return l2commit(db, patch)
    }

    const { session, rows } = patch

    console.log(patch.broker, patch.symbol, session, rows)

    return l2add(db, patch, session, rows)
      .then(commit)
  }

  const error = err => debug('Error: ', err.message)

  const complete = _ => debug('Complete')

  return Subscriber.create(next, error, complete)
}

/**
 * Expose
 */

module.exports = Sink
