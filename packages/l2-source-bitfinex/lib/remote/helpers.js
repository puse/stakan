const {
  compose,
  concat,
  toUpper,
  toLower,
  splitAt,
  replace,
  drop,
  join
} = require('ramda')

const symbolToPair = compose(
  concat('t'),
  replace('-', ''),
  toUpper
)

const symbolFrom = compose(
  join('-'),
  splitAt(-3),
  toLower,
  drop(1)
)

const rowFrom = raw => {
  const [ price, count, qty ] = raw

  const side = qty > 0
    ? 'bids'
    : 'asks'

  const amount = count > 0
    ? Math.abs(qty)
    : 0

  return {
    side,
    price,
    amount
  }
}

const isSnapshot = data =>
  Array.isArray(data[0])

module.exports = {
  symbolToPair,
  symbolFrom,
  rowFrom,
  isSnapshot
}
