const Redis = require('ioredis')

const setupScripts = require('./scripts')

/**
 *
 */

class Client extends Redis {
  constructor (...args) {
    super(...args)

    setupScripts(this)
  }
}

module.exports = Client
