const { Level } = require('@stakan/types')

function convert (triple) {
  const [price, count, amount] = triple

  const quantity = count === 0
    ? 0
    : amount

  return Level(price, quantity)
}

module.exports = convert
