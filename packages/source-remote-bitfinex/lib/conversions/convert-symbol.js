const R = require('ramda')

const { Symbol } = require('@stakan/types')

const toPairUpper = R.compose(
  R.map(R.toUpper),
  Symbol.toPair
)

function convert (symbol) {
  const [ base, quote ] = toPairUpper(symbol)
  return `t${base}${quote}`
}

module.exports = convert
