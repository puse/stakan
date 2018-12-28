const R = require('ramda')

/**
 * Settings
 */

const MAXLEN = 1000

/**
 * Helpers
 */

const argsFromLevel = R.compose(
  R.flatten,
  R.toPairs
)

const seqGen = (session = Date.now()) => {
  let i = 1
  return () => `${session}-${i++}`
}

const errorHandler = err => {
  throw err
}

function Sink (db, topic) {
  const key = String(topic)
  const seq = seqGen()

  const next = (level) => {
    const id = seq()
    const args = argsFromLevel(level)
    const limited = ['MAXLEN', '~', MAXLEN]

    db.xadd(key, ...limited, id, ...args)
      .catch(errorHandler)
  }

  return { next }
}

module.exports = Sink
