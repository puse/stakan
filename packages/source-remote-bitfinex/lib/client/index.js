const debug = require('debug')('stakan:source:remote:bitfinex')

const Bfx = require('bitfinex-api-node')

const settings = require('./settings')

/**
 * Methods
 */

function enableSequencing (client) {
  const assertSequencing = () => {
    const isEnabled = client.isFlagEnabled(65536)

    if (!isEnabled) {
      const err = new Error('seq enabled, but flag not updated')
      return Promise.reject(err)
    }

    debug('Remote sequencing enabled')
  }

  return client
    .enableSequencing({ audit: true })
    .then(assertSequencing)
}

function connect (client) {
  const callback = (resolve, reject) => {
    client
      .once('open', resolve)
      .once('error', reject)

    client.open()
  }

  return new Promise(callback)
}

/**
 * WS Client
 */

function Client () {
  return new Bfx(settings).ws()
}

// Expose

module.exports = Client

module.exports.create = () => {
  const client = Client()

  return connect(client)
    .then(() => enableSequencing(client))
    .then(() => client)
}
