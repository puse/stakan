const { tagged } = require('daggy')
const fl = require('fantasy-land')

const R = require('ramda')

//

const arrayFromValues = o => Array.from(o.values())

/**
 * Batch :: Array a => a -> Batch a
 */

const Batch = tagged('Batch', ['entries'])

/**
 * toArray :: Batch a ~> [a]
 */

Batch.prototype.toArray = function () {
  const { value } = this

  if (value) return value

  const appendTo = (acc, level) => acc.set(level.price, level)

  const pipe = R.compose(
    arrayFromValues,
    R.reduce(appendTo, new Map())
  )

  this.value = pipe(this.entries)

  return this.toArray()
}

Batch.prototype[Symbol.iterator] = function () {
  const entries = this.toArray()
  const length = entries.length

  let i = 0
  return {
    next: () => {
      return i < length
        ? { value: entries[i++] }
        : { done: true }
    }
  }
}

/**
 * concat :: Semigroup a => a ~> a -> a
 */

Batch.prototype[fl.concat] =
Batch.prototype.concat = function (that) {
  const xs = R.concat(this.entries, that.entries)
  return Batch(xs)
}

/**
 * empty :: Monoid m => () => m
 */

Batch.prototype[fl.empty] =
Batch.empty = function () {
  return new Batch([])
}

/**
 * filter :: Filterable f => f a ~> (a -> Boolean) -> f a
 */

Batch.prototype[fl.filter] =
Batch.prototype.filter = function (fn) {
  const filter = R.compose(Batch, R.filter(fn))
  return filter([...this])
}

/**
 * map :: Functor f => f a ~> (a -> b) -> f b
 */

Batch.prototype[fl.map] =
Batch.prototype.map = function (fn) {
  const map = R.compose(Batch, R.map(fn))
  return map([...this])
}

/**
 * reduce :: Foldable f => f a ~> ((b, a) -> b, b) -> b
 */

Batch.prototype[fl.reduce] =
Batch.prototype.reduce = function (fn, acc) {
  const reduce = R.reduce(fn, acc)
  return reduce([...this])
}

// export

module.exports = Batch
