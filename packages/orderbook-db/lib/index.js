const { readFileSync } = require('fs')

const Redis = require('ioredis')

const {
  assoc,
  fromPairs,
  compose,
  map,
  zipObj,
  splitEvery,
  flatten,
  props
} = require('ramda')

const setupScripts = require('./scripts')

/**
 *
 */

const { Command } = Redis

/**
 * Utils
 */


/**
 *
 */

class Client extends Redis {
  constructor () {
    super()

    setupScripts(this)
  }

  obcommit (...args) {
    return this.OBCOMMIT(...args)
  }

}

module.exports = Client
