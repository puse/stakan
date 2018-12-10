const R = require('ramda')

/**
 * Helpers
 */

/**
 * Get a tuple
 */

const convert = spec => {
  const { side, price, amount } = spec

  const key = side === 'asks'
    ? price
    : price * -1

  return [ key, amount ]
}

const recover = pair => {
  const [ key, amount ] = pair

  const side = key < 0
    ? 'bids'
    : 'asks'

  const price = Math.abs(key)

  return { side, price, amount }
}

/**
 *
 */

class Depth {
  constructor (pairs = []) {
    this.value = new Map(pairs)
  }

  get entries () {
    return R.map(recover, [...this.value])
  }

  inspect () {
    const val = JSON
      .stringify(this.entries, null, 2)

    return `Depht (${val})`
  }

  // concat :: Depth a => a ~> a -> a

  concat (that) {
    const entries = R.concat(this.entries, that.entries)
    return Depth.from(entries)
  }

  map (fn) {
    const entries = R.map(fn, this.entries)
    return Depth.from(entries)
  }

  reduce (fn, acc) {
    return R.reduce(fn, acc, this.entries)
  }

  filter (pred) {
    const entries = R.filter(pred, this.entries)
    return Depth.from(entries)
  }

  static empty () {
    return new Depth()
  }

  static of (spec) {
    const entries = [ convert(spec) ]
    return new Depth(entries)
  }

  static from (entries) {
    const pairs = R.map(convert, entries)
    return new Depth(pairs)
  }
}

module.exports = Depth
