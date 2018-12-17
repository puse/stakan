const R = require('ramda')

const Side = require('./internal/depth.side')

const { cached } = require('./internal/utils')

/**
 * Asks
 */

class Asks extends Side {
  constructor (entries = []) {
    super(entries)

    // sort from lowest (best) to highest
    const byPrice = R.ascend(R.prop(0))

    const get = R.compose(
      R.sort(byPrice),
      this.valueOf
    )

    this.valueOf = R.thunkify (cached(get)) ()
  }
}

/**
 * Expose constructor
 */

module.exports = Asks
