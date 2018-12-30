const R = require('ramda')

const stamp = require('./stamp')

const connectors = require('./connectors')

/**
 * Remote
 */

function Source (config, topic) {
  if (!R.is(Source, this)) return new Source(config, topic)

  const { broker, symbol } = topic

  const Connector = connectors[broker]

  if (!Connector) {
    const message = `no connector for ${broker}`
    throw new RangeError(message)
  }

  return Connector(config)
    .observeOrderBookLevels(symbol)
    .pipe(stamp())
}

/**
 * Expose Source
 */

module.exports = Source
