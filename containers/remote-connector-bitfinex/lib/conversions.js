const R = require('ramda')

/**
 * convertSymbol :: String s => s -> s
 */

const convertSymbol = symbol => {
  // btc-usd -> [btc, usd]
  const toPair = R.split('-')
  // [btc, usd] -> [BTC, USD]
  const toUpperEach = R.map(R.toUpper)
  // [BTC, USD] -> BTCUSD
  const join = R.reduce(R.concat, '')
  // BTCUSD -> tBTCUSD
  const prefix = R.concat('t')

  const convert = R.compose(prefix, join, toUpperEach, toPair)

  return convert(symbol)
}

/**
 * recoverLevel :: [Number, Number, Number] -> Level
 */

const recoverLevel = raw => {
  // [3880, 1, 0.3]
  const [price, count, amount] = raw

  const quantity = count === 0
    ? 0
    : amount

  return { price, quantity }
}

module.exports = {
  convertSymbol,
  recoverLevel
}
