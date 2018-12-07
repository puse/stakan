const {
  objOf,
  head,
  converge,
  merge,
  pick,
  mergeDeepRight,
  pluck,
  assoc,
  zipObj,
  toPairs,
  reduce,
  assocPath,
  compose,
  juxt,
  map,
  unnest,
  prop
} = require('ramda')

const {
  compact
} = require('ramda-adjunct')

const pack = (rows = []) => {
  const it = (acc, row) => {
    const { side, price, amount } = row
    const key = [ side, String(price) ]
    return assocPath(key, amount, acc)
  }

  return reduce(it, {}, rows)
}

const unpack = (packed = {}) => {
  const from = side => compose(
    assoc('side', side),
    zipObj(['price', 'amount']),
    map(Number)
  )

  const of = side => compose(
    map(from(side)),
    toPairs,
    prop(side)
  )

  const un = compose(
    unnest,
    juxt([ of('bids'), of('asks') ])
  )

  return un(packed)
}

const mergeUpdates = updates => {
  const { broker, symbol, session } = updates
  const stamp = compose(
    pick([
      'broker',
      'symbol',
      'session'
    ]),
    head
  )

  const stat = compose(
    objOf('rows'),
    unpack,
    reduce(mergeDeepRight, {}),
    map(pack),
    pluck('rows')
  )

  const all = converge(merge, [ stat, stamp ])

  return all(updates)
}

module.exports = {
  pack,
  unpack,
  mergeUpdates
}
