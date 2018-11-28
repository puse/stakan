const debug = require('debug')('stakan:l2:db')

const { Subscriber } = require('rxjs/Rx')

const {
  head,
  last,
  juxt,
  identity
} = require('ramda')

const {
  l2add,
  l2commit
} = require('@stakan/db-methods')

/**
 * Helpers
 */

const rangeFrom = juxt([ head, last ])

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
    const commit = ids => {
      const [start, end] = rangeFrom(ids)
      return l2commit(db, patch, start, end)
    }

    return l2add(db, patch).then(commit)
  }

  const error = err => debug('Error: ', err.message)

  const complete = _ => debug('Complete')

  return Subscriber.create(next, error, complete)
}

/**
 * Expose
 */

module.exports = Sink
