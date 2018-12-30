const R = require('ramda')

/**
 * Settings
 */

const MAXLEN = 1000

/**
 * Helpers
 */

const errorHandler = err => {
  throw err
}

/**
 * Getters
 */

const keyFromTopic = R.compose(
  R.join('/'),
  R.props(['broker', 'symbol'])
)

const idFromPacket = R.compose(
  R.join('-'),
  R.props(['session', 'offset'])
)

const arrFromLevel = R.compose(
  R.flatten,
  R.toPairs
)

/**
 * Sink
 */

function Sink (db, topic) {
  const key = keyFromTopic(topic)

  const next = (packet) => {
    const id = idFromPacket(packet.id)
    const args = arrFromLevel(packet.level)

    const limited = ['MAXLEN', '~', MAXLEN]

    db.xadd(key, ...limited, id, ...args)
      .catch(errorHandler)
  }

  return { next }
}

module.exports = Sink
