const connectors = require('./source-connectors')

function Source (topic) {
  const { broker, symbol } = topic

  const Connector = connectors[broker]

  if (!Connector) {
    const message = `No connector for ${broker}`
    throw new Error(message)
  }

  return Connector(symbol)
}

module.exports = Source
