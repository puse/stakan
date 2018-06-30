const { readFileSync } = require('fs')

const Redis = require('ioredis')

const setupScripts = require('./scripts')

/**
 *
 */


/**
 * Utils
 */


/**
 *
 */

function Client (opts) {
  const client = new Redis(opts)

  setupScripts(client)

  return client
}

module.exports = Client
