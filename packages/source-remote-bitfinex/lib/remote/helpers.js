const R = require('ramda')

/**
 * Call `f` on first invocation, then `g` on rest
 *
 * @sig
 *
 * onceThen :: Function f => f -> f -> f
 */

const onceThen = (f, g) => {
  let called = false

  return (...args) => {
    if (!called) {
      called = true
      return f(...args)
    }

    return g(...args)
  }
}

// Expose curried

module.exports.onceThen = R.curry(onceThen)
