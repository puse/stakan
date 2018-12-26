const { tagged } = require('daggy')

/**
 * Level { price String, quantity String }
 */

const Level = tagged('Level', ['price', 'quantity'])

/**
 * recoverLevel :: [Number, Number, Number] -> Level
 */

Level.fromBitfinex = (triple) => {
  const [price, count, amount] = triple

  const quantity = count === 0
    ? 0
    : amount

  return Level(price, quantity)
}

module.exports = Level
