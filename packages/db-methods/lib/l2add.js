const {
  flatten,
  toPairs,
  compose,
  prop,
  props,
  map,
  groupBy
} = require('ramda')

const {
  targetToString
} = require('./helpers')

/**
 * Helpers
 */

const parseEntries = map(props(['price', 'amount']))

const parseArgs = compose(
  flatten,               // ['bids', 500, 1.2, 499, 0.8, ... ]
  toPairs,               // [ ['bids', [[], ...]], ...]
  map(parseEntries),     // { bids: [[], ...], ... }
  groupBy(prop('side'))  // { bids: [{}, ...], ... }
)

/**
 * Add to journal
 *
 * @async
 *
 * @param {Redis} db
 * @param {Topic} topic
 * @param {Number} session
 * @param {Array} rows
 *
 * @return {Promise} - last inserted rev id
 */

function l2add (db, topic, session, rows) {
  const uri = targetToString(topic)

  const args = parseArgs(rows)

  return db
    .l2add(uri, session, ...args)
}

module.exports = l2add
