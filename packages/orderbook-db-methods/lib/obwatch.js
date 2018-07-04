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
  splitEvery(2)
)

const parseEntry = pair => {
  const [ id, arr ] = pair

  const entry =  parseArr(arr)

  return assoc('id', id, entry)
}

function obwatch (db, target, rev = '$', timeout = 1000) {
  const params = targetFrom(target)
  const key = targetToString(target) + ':ob:log'

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

module.exports = obwatch
