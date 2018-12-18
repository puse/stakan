const R = require('ramda')

/**
 * Memoize
 *
 * cached :: (a -> b) -> a -> b
 *
 */

const cached = R.memoizeWith(R.identity)

/**
 * Expose
 */

module.exports = {
  cached
}
