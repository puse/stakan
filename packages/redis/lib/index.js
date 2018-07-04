const Redis = require('ioredis')

const setupScripts = require('./scripts')

const { Command } = Redis

/**
 *
 */

class Client extends Redis {
  constructor (...args) {
    super(...args)

    setupScripts(this)
  }

  xread (...args) {
    const cmd = new Command('xread', args, 'utf8')

    return this.sendCommand(cmd)
  }
}

module.exports = Client
