const R = require('ramda')

const Side = require('./internal/depth.side')

/**
 * Memoize
 *
 * cached :: (a -> b) -> a -> b
 *
 */

const cached = R.memoizeWith(R.identity)

/**
 * Bids
 */

class Bids extends Side {
  constructor (entries = []) {
    super(entries)

    // sort from highes (best) to lowest
    const byPrice = R.descend(R.prop(0))

    const get = R.compose(
      R.sort(byPrice),
      this.valueOf
    )

    this.valueOf = R.thunkify (cached(get)) ()
  }
}

/**
 * Bids
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

module.exports.Bids = Bids
module.exports.Asks = Asks
