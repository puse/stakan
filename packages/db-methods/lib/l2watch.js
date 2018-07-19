const {
  merge,
  compose,
  fromPairs,
  splitEvery,
  assoc,
  map
} = require('ramda')

const {
  targetFrom,
  targetToString
} = require('./helpers')

/**
 * Helpers
 */

const parseArr = compose(
  fromPairs,
  splitEvery(2),
  map(String)
)

const parseEntry = pair => {
  const [ id, arr ] = pair

  const entry =  parseArr(arr)

  return assoc('id', String(id), entry)
}

function l2watch (db, target, rev = '$', timeout = 1000) {
  const params = targetFrom(target)
  const key = targetToString(target) + ':log'

  const args = [
    'BLOCK', timeout,
    'streams', key, rev
  ]

  const rowOf = compose(
    merge(params),
    parseEntry
  )

  const recover = result =>
    result
      ? map(rowOf, result[0][1])
      : result

  return db
    .xread(...args)
    .then(recover)
}

module.exports = l2watch
