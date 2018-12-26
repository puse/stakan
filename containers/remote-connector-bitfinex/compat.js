const R = require('ramda')

const Op = require('rxjs/operators')

const rowFrom = raw => {
  const [ price, count, qty ] = raw

  const side = qty > 0
    ? 'bids'
    : 'asks'

  const amount = count > 0
    ? Math.abs(qty)
    : 0

  return { side, price, amount }
}

function main (target) {
  const session = Date.now()

  const convert = levels => {
    const rows = R.map(rowFrom, levels)
    return R.merge(target, { session, rows })
  }

  return source =>
    source.pipe(
      Op.bufferTime(25),
      Op.filter(R.length),
      Op.map(convert)
    )
}

module.exports = main
