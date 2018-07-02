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
  tap(console.log),
  map(parseEntries), // { bids: [[], ...], ... }
  groupBy(prop('side')) // { bids: [{}, ...], ... }
)

function obadd (db, data, rows) {
  const { session } = data

  const uri = targetToString(data)

  const args = parseArgs(rows || data.rows)

  return db
    .OBADD(uri, session, ...args)
}

module.exports = obadd
