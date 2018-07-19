const {
  tap,
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
  flatten,
  toPairs,
  map(parseEntries), // { bids: [[], ...], ... }
  groupBy(prop('side')) // { bids: [{}, ...], ... }
)

function l2add (db, data, ...rest) {
  let session, rows

  if (rest.length === 0) {
    session = data.session
    rows = data.rows
  } else {
    session = rest[0]
    rows = rest[1]
  }

  const uri = targetToString(data)

  const args = parseArgs(rows || data.rows)

  return db
    .l2add(uri, session, ...args)
}

module.exports = l2add
