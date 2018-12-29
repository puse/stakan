const R = require('ramda')

/**
 * Settings
 */

const MAXLEN = 1000

/**
 * Helpers
 */

const arrFromLevel = R.compose(
  R.flatten,
  R.toPairs
)

const keyFromTopic = R.compose(
  R.join('/'),
  R.props(['broker', 'symbol'])
)

const seqGen = (session = Date.now()) => {
  let i = 1
  return () => `${session}-${i++}`
}

const errorHandler = err => {
  throw err
}

function Sink (db, topic) {
  const key = keyFromTopic(topic)
  const seq = seqGen()

  const next = (level) => {
    const id = seq()
    const args = arrFromLevel(level)
    const limited = ['MAXLEN', '~', MAXLEN]

    db.xadd(key, ...limited, id, ...args)
      .catch(errorHandler)
  }

  return { next }
}

module.exports = Sink
