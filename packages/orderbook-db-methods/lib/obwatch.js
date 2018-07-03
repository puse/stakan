const { Command } = require('ioredis')

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

const commandOf = (key, args) =>
  new Command(key, args, { replyEncoding: 'utf8' })

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

  const cmd = commandOf('xread', args)

  const rowOf = compose(
    merge(params),
    parseEntry
  )

  const recover = result =>
    result
      ? map(rowOf, result[0][1])
      : result

  return db
    .sendCommand(cmd)
    .then(recover)
}

module.exports = obwatch
