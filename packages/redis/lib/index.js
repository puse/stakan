const Redis = require('ioredis')

const scripts = require('@stakan/redis-scripts')

/**
 *
 */

class Client extends Redis {
  constructor (...args) {
    super(...args)

    for (let key in scripts) {
      this.defineCommand(key, scripts[key])
    }

    return this
  }
}

module.exports = Client
