const R = require('ramda')

const Side = require('./internal/depth.side')

const { cached } = require('./internal/utils')

/**
 * Bids
 */

class Bids extends Side {
  constructor (entries) {
    super(entries)

    // sort from highes (best) to lowest
    const byPrice = R.descend(R.prop(0))

    const get = R.compose(
      R.sort(byPrice),
      this.valueOf
    )

    this.valueOf = R.thunkify(cached(get))()
  }
}

/**
 * Expose constructor
 */

module.exports = Bids
