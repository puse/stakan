const { tagged } = require('daggy')

/**
 * Constants
 */

const FIELDS = ['price', 'quantity']

/**
 * type Level p q
 */

const Level = tagged('Level', FIELDS)

// Expose

module.exports = Level
