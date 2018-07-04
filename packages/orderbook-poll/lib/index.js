const {
  Observable,
  ReplaySubject
} = require('rxjs/Rx')

const {
  compose,
  assoc,
  map,
  toPairs,
  zipObj,
  propEq,
  concat,
  head,
  last,
  identity
} = require('ramda')

const pollMqtt = require('./mqtt')
const pollHttp = require('./http')

const nextRevOf = rev => {
  const [ seed, offset ] = rev
    .split('-')
    .map(Number)

  return `${seed}-${offset+1}`
}

const flattenSides = obj => {
  const one = arr => {
    const [ side, list ] = arr

    return list.map(assoc('side', side))
  }

  const op = compose(
    sides => concat(...sides),
    map(one), toPairs)

  return op(obj)
}

const rowFromPair = compose(
  zipObj(['price', 'amount']),
  map(Number)
)

const fromDict = compose(
  map(rowFromPair),
  toPairs
)

const rowsFromSides = sides => {
  const bids = fromDict(sides.bids)
  const asks = fromDict(sides.asks)

  return flattenSides({ bids, asks })
}

function Poller (opts = {}, target) {
  const update$ = new ReplaySubject()

  pollMqtt(opts.mqtt, target).subscribe(update$)

  const pollUpdate = snapshot => {
    const sides = {
      bids: {},
      asks: {}
    }

    const commit = row => {
      const price = String(row.price)
      const amount = Number(row.amount)

      const dict = sides[row.side]

      if (amount > 0) {
        dict[price] = amount
      } else {
        delete dict[price]
      }

      return {
        rows   : rowsFromSides(sides),
        rev    : row.id,
        broker : row.broker,
        symbol : row.symbol
      }
    }

    snapshot.rows.forEach(commit)

    return update$
      .skipWhile(propEq('id', snapshot.rev))
      .map(commit)
  }

  const pollSnapshot = _ =>
    pollHttp(opts.http, target)
      .first()
      .flatMap(pollUpdate)

  const validate = (prev, next) => {
    const isNext = next.rev === nextRevOf(prev.rev)

    if (isNext) return next

    throw new Error('bad id')
  }

  return update$
    .first()
    .switchMap(pollSnapshot)
    .scan(validate)
    .filter(identity)
}

module.exports = Poller
