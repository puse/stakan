const R = require('ramda')

/**
 * Memoize
 *
 * cached :: (a -> b) -> a -> b
 * 
 */

const cached = R.memoizeWith(R.identity)

/**
 * Bids collection
 *
 * Bids :: [Order] -> Bids
 */

class Bids {
  /**
   * of 
   */

  static of (entry) {
    return new Bids([ entry ])
  }

  /**
   * from 
   */

  static from (entries = []) {
    return new Bids(entries)
  }

  /**
   * empty :: Bids m => () -> m
   */

  static empty () {
    return new Bids
  }

  constructor (entries = []) {
    // sort from highes (best) to lowest
    const byPrice = R.descend(R.prop(0))

    const get = R.compose(
      R.sort(byPrice), 
      xs => [...new Map(xs)] // eliminate duplicate keys
    )

    this.valueOf = R.thunkify (cached(get)) (entries)
  }

  /**
   * equals :: Bids a => a ~> a -> Boolean
   */

  equals (that) {
    return R.equals([...this], [...that])
  }

  /**
   * concat :: Bids a => a ~> a -> a
   */

  concat (that) {
    return Bids.from([...this, ...that])
  }

  /**
   * map :: Bids f => f a ~> (a -> b) -> f b
   */

  map (fn) {
    const entries = R.map(fn, [...this])
    return Bids.from(entries)
  }

  /**
   * filter :: Bids f => f a ~> (a -> Boolean) -> f a
   */

  filter (pred) {
    const entries = R.filter(pred, [...this])
    return Bids.from(entries)
  }

  /**
   * reduce :: Foldable f => f a ~> ((b, a) -> b, b) -> b
   */

  reduce (fn, acc) {
    return R.reduce(fn, acc, [...this])
  }

  //

  toArray () {
    return this.valueOf()
  }

  [Symbol.iterator]() {
    const entries = this.valueOf()
    let i = 0
    return {
      next: () => {
        if (i === entries.length) {
          return { done: true }
        }
        return { value: entries[i++] }
      }
    }
  }

}

module.exports = Bids
