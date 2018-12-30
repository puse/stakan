const connectors = require('./source-connectors')

/**
 * stamp :: Int -> () -> String
 */

function stamp (session = Date.now()) {
  return (level, offset) => {
    return {
      id: {
        session,
        offset
      },
      level
    }
  }
}

function Source (topic) {
  const { broker, symbol } = topic

  const Connector = connectors[broker]

  if (!Connector) {
    const message = `No connector for ${broker}`
    throw new Error(message)
  }

  const remote = Connector(symbol)

  return {
    observe () {
      return remote
        .observe()
        .map(stamp())
    }
  }
}

module.exports = Source
