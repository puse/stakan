const R = require('ramda')

const Order = R.curry(
  (side, price, amount) => {
    return { side, amount, price }
  }
)

const toPair = R.props(['price', 'amount'])

const mergeSides = R.compose(
  R.toPairs,
  R.fromPairs,
  R.map(toPair)
)

const convert = R.compose(
  R.map(R.defaultTo([])),
  R.props(['bids', 'asks']),
  R.groupBy(R.prop('side'))
)

const toOrderOf = side => R.compose(
  R.apply(Order(side)),
  R.map(Number)
)

const ordersFrom = side => R.compose(
  R.map(toOrderOf(side)),
  side === 'bids'
    ? R.head
    : R.last
)

const concat = R.compose(
  R.converge(
    R.concat,
    [ ordersFrom('bids'),
      ordersFrom('asks') ]),
  R.map(mergeSides),
  R.useWith(
    R.zipWith(R.concat),
    [ convert,
      convert ])
)

module.exports = R.curry(concat)
