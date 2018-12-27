const debug = require('debug')('stakan:source:remote:bitfinex')

const Bfx = require('bitfinex-api-node')

const R = require('ramda')

/**
 * Settings
 */

const DEFAULT_OPTIONS = {
  ws: {
    autoReconnect: false,
    seqAudit: true,
    packetWDDelay: 10 * 1000
  }
}

/**
 * Methods
 */

function enableSequencing (client) {
  const assertSequencing = () => {
    if (!client.isFlagEnabled(65536)) {
      const err = new Error('seq enable succeeded, but flag not updated')
      return Promise.reject(err)
    }

    debug('sequencing enabled')
    return Promise.resolve(client)
  }

  return client
    .enableSequencing({ audit: true })
    .then(assertSequencing)
    .then(() => client)
}

/**
 * WS Client
 */

function Client (opts = {}) {
  const settings = R.merge(DEFAULT_OPTIONS, opts)

  const bfs = new Bfx(settings)

  const ws = bfs.ws()

  return ws
}

// Expose

module.exports = Client

module.exports.enableSequencing = enableSequencing
