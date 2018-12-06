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

/**
 * Watch for additions
 */

function l2watch (db, topic, rev = '$', timeout = 1000) {
  const target = targetFrom(topic)
  const key = targetToString(topic) + ':journal'

  const args = [
    'BLOCK', timeout,
    'streams', key, rev
  ]

  const rowOf = compose(
    merge(target),
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
