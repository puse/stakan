const R = require('ramda')

const Depth = require('@stakan/fx-l2/lib/depth')

const concat = updates => {
  const stamp = R.compose(
    R.pick([
      'broker',
      'symbol',
      'session'
    ]),
    R.head
  )

  const stat = R.compose(
    R.objOf('rows'),
    R.sortBy(R.prop('price')),
    R.prop('entries'),
    R.reduce(R.concat, Depth.empty()),
    R.map(Depth.from),
    R.pluck('rows')
  )

  const all = R.converge(R.merge, [ stat, stamp ])

  return all(updates)
}

module.exports = {
  concat
}
