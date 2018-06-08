const {
  Observable,
  Subject
} = require('rxjs/Rx')

const {
  assoc,
  compose,
  reduce,
  pluck,
  applySpec,
  prop,
  last
} = require('ramda')

const {
  isNotEmpty
} = require('ramda-adjunct')

const Client = require('./lib/client')
const Store = require('./lib/store')
const Channel = require('./lib/channel')

const OBH = require('./lib/helpers')

const client = new Client('btc-usd')
const store = new Store()
const channel = new Channel()

const input$ = new Subject()

const reset$ = Observable
  .fromEvent(client, 'reset')

const update$ = Observable
  .fromEvent(client, 'update')
  .bufferTime(25)
  .filter(isNotEmpty)
  .map(arr => {
    const concatAll = reduce(OBH.concat, [])

    const op = applySpec({
      ev     : compose(prop('ev'), last),
      broker : compose(prop('broker'), last),
      symbol : compose(prop('symbol'), last),
      bids   : compose(concatAll, pluck('bids')),
      asks   : compose(concatAll, pluck('asks'))
    })

    return op(arr)
  })

reset$
  .merge(update$)
  .flatMap(x => {
    return x.ev === 'reset'
      ? store.resetOrderBook(x)
      : store.updateOrderBook(x)
  })
  .subscribe(channel)

//
function ingest (x) {
  console.log(x)
}

client.sync()
