const { tagged } = require('daggy')

/**
 * Symbol { base String, quote String }
 */

const Symbol = tagged('Symbol', ['base', 'quote'])

Symbol.prototype.toString = function (format) {
  const { base, quote } = this

  switch (format) {
    case 'bitfinex':
      const baseUpper = base.toUpperCase()
      const quoteUpper = quote.toUpperCase()
      return `t${baseUpper}${quoteUpper}`

    default:
      return `${base}-${quote}`
  }
}

Symbol.fromString = (string) => {
  // 'BTC-USD' -> ['btc', 'usd']
  const pair = string
    .toLowerCase()
    .split('-')

  const [ base, quote ] = pair

  return Symbol(base, quote)
}

module.exports = Symbol
