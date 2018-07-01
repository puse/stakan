const debug = require('debug')('stakan:sync:cexio')

const { createPool } = require('generic-pool')

const factory = require('./ws')

/**
 * Constants
 */

/**
 * Pool config
 */

const CONFIG = {
  max: 2,
  testOnBorrow: true
}

/**
 * Pool constructor
 *
 * @param {Object} [opts] - Options for `generic-pool`
 *
 * @returns {Pool}
 */

function Pool (opts = CONFIG) {
  return createPool(factory, opts)
}

/**
 * Expose constructor
 */

module.exports = Pool
