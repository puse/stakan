const R = require('ramda')
const RA = require('ramda-adjunct')

const Depth = require('@stakan/fx-l2/lib/depth')

const STAMP_PROPS = [ 'broker', 'symbol', 'session' ]

const initialProps = R.compose(
  R.pick(STAMP_PROPS),
  R.head
)

const sortByPrice = R.sortBy(R.prop('price'))

const concatRows = R.compose(
  R.prop('entries'),
  Depth.from,
  RA.concatAll,
  R.pluck('rows')
)

const aggregateRows = R.compose(
  R.objOf('rows'),
  sortByPrice,
  concatRows,
)

const concat = R.converge(
  R.merge,
  [ aggregateRows,
    initialProps ] )

module.exports = {
  concat
}
