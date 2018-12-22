const daggy = require('daggy')

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
 * equals :: Level a => a ~> a -> Boolean
 */

Level.prototype.equals = function (that) {
  const throws = () => {
    const message = `Can't compare ${this} with ${that}`
    throw new TypeError(message)
  }

  return this.cata({
    Bid: (a) => that.cata({
      Bid: (b) => a === b,
      Ask: throws,
      Nil: throws
    }),
    Ask: (a) => that.cata({
      Bid: throws,
      Ask: (b) => a === b,
      Nil: throws
    }),
    Nil: (a) => that.cata({
      Bid: throws,
      Ask: throws,
      Nil: (b) => a === b
    })
  })
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
 * lt :: Level a => a ~> a -> Boolean
 */

Level.prototype.lt = function (that) {
  return this.lte(that) && !this.equals(that)
}

/**
 * gte :: Level a => a ~> a -> Boolean
 */

Level.prototype.gte = function (that) {
  return !this.lt(that)
}

/**
 * gt :: Level a => a ~> a -> Boolean
 */

Level.prototype.gt = function (that) {
  return this.gte(that) && !this.equals(that)
}

// Expose

module.exports = Level
