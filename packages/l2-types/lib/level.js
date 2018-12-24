const daggy = require('daggy')

/**
 * Helpers
 */

const assertSameTags = (a, b) => {
  const tagA = a['@@tag']
  const tagB = b['@@tag']

  if (tagA !== tagB) {
    const message = `Can't compare ${tagA} to ${tagB}`
    throw new TypeError(message)
  }
}

/**
 * type Level p q
 *   = Nil p
 *   | Bid p q
 *   | Ask p q
 */

const Level = daggy.taggedSum('Level', {
  Nil: ['price'],
  Bid: ['price', 'quantity'],
  Ask: ['price', 'quantity']
})

/**
 * equals :: Bid a => a ~> a -> Boolean
 * equals :: Ask a => a ~> a -> Boolean
 * equals :: Nil a => a ~> a -> Boolean
 */

Level.prototype.equals = function (that) {
  assertSameTags(this, that)

  return this.price === that.price
}

/**
 * lte :: Bid a => a ~> a -> Boolean
 * lte :: Ask a => a ~> a -> Boolean
 */

Level.prototype.lte = function (that) {
  const throws = () => {
    const message = `Can't compare ${this} with ${that}`
    throw new TypeError(message)
  }

  return this.cata({
    Bid: (a) => that.cata({
      Bid: (b) => a >= b,
      Ask: throws
    }),
    Ask: (a) => that.cata({
      Bid: throws,
      Ask: (b) => a <= b
    })
  })
}

/**
 * lt :: Bid a => a ~> a -> Boolean
 * lt :: Ask a => a ~> a -> Boolean
 */

Level.prototype.lt = function (that) {
  return this.lte(that) && !this.equals(that)
}

/**
 * gte :: Bid a => a ~> a -> Boolean
 * gte :: Ask a => a ~> a -> Boolean
 */

Level.prototype.gte = function (that) {
  return !this.lt(that)
}

/**
 * gt :: Bid a => a ~> a -> Boolean
 * gt :: Ask a => a ~> a -> Boolean
 */

Level.prototype.gt = function (that) {
  return this.gte(that) && !this.equals(that)
}

// Expose

module.exports = Level
