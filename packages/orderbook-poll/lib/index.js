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
  concat
} = require('ramda')

const pollMqtt = require('./mqtt')
const pollHttp = require('./http')

const flattenSides = obj => {
  const one = arr => {
    const [ side, list ] = arr

    return list.map(assoc('side', side))
  }

  const op = compose(
    sides => concat(...sides),
    map(one),
    toPairs
  )

  return op(obj)
}

const rowsFromSides = sides => {
  const fromPair = compose(
    zipObj(['price', 'amount']),
    map(Number)
  )

  const fromDict = compose(
    map(fromPair),
    toPairs
  )

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
        rev    : row.id,
        rows   : rowsFromSides(sides),
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

  return update$
    .first()
    .switchMap(pollSnapshot)
}

const OPTIONS = {
  mqtt: { url: 'mqtt://localhost:1883' },
  http: { baseURL: 'http://localhost:8080' }
}

Poller(OPTIONS, 'cexio/btc-usd')
  .subscribe(console.log)
