const R = require('ramda')

const { cached } = require('./utils')

/**
 * Side collection
 *
 * Side :: [Order] -> Side
 */

class Side {
  /**
   * of
   */

  static of (entry) {
    return new Side([ entry ])
  }

  /**
   * from
   */

  static from (entries = []) {
    return new Side(entries)
  }

  /**
   * empty :: Side m => () -> m
   */

  static empty () {
    return new Side
  }

  constructor (entries = []) {
    const get = xs => [...new Map(xs)] // eliminate duplicates

    this.valueOf = R.thunkify (cached(get)) (entries)
  }

  /**
   * equals :: Side a => a ~> a -> Boolean
   */

  equals (that) {
    return R.equals([...this], [...that])
  }

  /**
   * concat :: Side a => a ~> a -> a
   */

  concat (that) {
    return Side.from([...this, ...that])
  }

  /**
   * map :: Side f => f a ~> (a -> b) -> f b
   */

  map (fn) {
    const entries = R.map(fn, [...this])
    return Side.from(entries)
  }

  /**
   * filter :: Side f => f a ~> (a -> Boolean) -> f a
   */

  filter (pred) {
    const entries = R.filter(pred, [...this])
    return Side.from(entries)
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

module.exports = Side
