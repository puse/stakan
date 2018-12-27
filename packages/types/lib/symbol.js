const { tagged } = require('daggy')

const R = require('ramda')

/**
 * Constants
 */

const FIELDS = ['base', 'quote']

/**
 * type Symbol {
 *   base String
 *   quote String
 * }
 */

const Symbol = tagged('Symbol', FIELDS)

/**
 * Helpers
 */

const normalizeString = R.compose(R.trim, R.toLower)

/**
 * Static methods
 */

Symbol.fromPair = (pair) => Symbol(...pair)

Symbol.toPair = R.props(FIELDS)

Symbol.fromString = R.compose(
  Symbol.fromPair,
  R.split('-'),
  normalizeString
)

Symbol.toString = R.compose(
  R.join('-'),
  Symbol.toPair
)

/**
 * Prototype methods
 */

Symbol.prototype.toArray =
Symbol.prototype.toPair = function () {
  return Symbol.toPair(this)
}

Symbol.prototype.valueOf =
Symbol.prototype.toString = function () {
  return Symbol.toString(this)
}

// Expose

module.exports = Symbol
