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
}

module.exports = Client
