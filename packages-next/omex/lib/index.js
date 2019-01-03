const R = require('ramda')

const DB = require('./db-methods')

/**
 * Settings
 */

const MAXLEN = 1000

/**
 * Helpers
 */

const errorHandler = err => {
  throw err
}

/**
 * Getters
 */

const keyFromTopic = R.compose(
  R.join('/'),
  R.props(['broker', 'symbol'])
)

const idFromHeader = R.compose(
  R.join('-'),
  R.props(['session', 'offset'])
)

const arrFromLevel = R.compose(
  R.flatten,
  R.toPairs
)

/**
 * Sink
 */

function Sink (db, topic) {
  const key = keyFromTopic(topic)

  const next = (record) => {
    DB.add(db, key, record)
      .catch(errorHandler)
  }

  return { next }
}

module.exports = Sink
