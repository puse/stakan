const {
  merge,
  splitEvery,
  zipObj,
  propOr,
  compose,
  concat,
  map,
  assoc
} = require('ramda')

const {
  keyFor,
  targetFrom,
  targetToString
} = require('./helpers')

/**
 * Helpers
 */

const parseAs = (side, data) => {
  const parse = compose(
    assoc('side', side),
    zipObj(['price', 'amount'])
  )

  const op = compose(
    map(parse),
    splitEvery(2),
    map(Number),
    propOr([], side)
  )

  return op(data)
}

const rowsFrom = ob => {
  const bids = parseAs('bids', ob)
  const asks = parseAs('asks', ob)

  return concat(bids, asks)
}

const recover = res => {
  const [ rev, bids, asks ] = res

  const rows = rowsFrom({ bids, asks })

  return { rev, rows }
}

/**
 * Read orderbook entries
 *
 * @param {Object} topic
 */

function l2depth (db, topic) {
  const target = targetFrom(topic)
  const uri = targetToString(topic)

  return db
    .l2depth(uri)
    .then(recover)
    .then(merge(target))
}

module.exports = l2depth
