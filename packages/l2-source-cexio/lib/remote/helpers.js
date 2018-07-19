const {
  curry,
  compose,
  concat,
  assoc,
  toUpper,
  toLower,
  split,
  replace,
  zipObj,
  map
} = require('ramda')

const symbolToPair = compose(
  split('-'),
  toUpper
)

const symbolFrom = compose(
  toLower,
  replace(':', '-')
)

const rowFrom = zipObj(['price', 'amount'])

const rowOf = side => compose(
  assoc('side', side),
  zipObj(['price', 'amount'])
)

function patchFor (symbol, session, raw) {
  const broker = 'cexio'

  const bids = map(rowOf('bids'), raw.bids)
  const asks = map(rowOf('asks'), raw.asks)

  return {
    broker,
    symbol,
    session,
    rows: concat(bids, asks)
  }
}

module.exports = {
  symbolToPair,
  symbolFrom,
  rowFrom,
  patchFor: curry(patchFor)
}
