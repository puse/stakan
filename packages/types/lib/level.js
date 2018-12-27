const { tagged } = require('daggy')

const R = require('ramda')

/**
 * Constants
 */

const FIELDS = ['price', 'quantity']

/**
 * type Level p q
 */

const Level = tagged('Level', FIELDS)

/**
 * Static methods
 */

Level.toPairs = R.toPairs

/**
 * Prototype methods
 */

Level.prototype.toPairs = function () {
  return Level.toPairs(this)
}

// Expose

module.exports = Level
