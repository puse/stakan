const { Observable } = require('rxjs/Rx')

const OrderbookDB = require('@stakan/orderbook-db')

const {
  head,
  last,
  props,
  juxt
} = require('ramda')

const Remote = require('./lib')

const db = new OrderbookDB()
const remote = new Remote('btc-usd')

const close$ = Observable
  .fromEvent(remote, 'close')

const orderbook$ = Observable
  .fromEvent(remote, 'update')
  .takeUntil(close$)

const topicOf = ({ broker, symbol }) =>
  `${broker}:${symbol}`

async function applyPatch (patch) {
  const { broker, symbol } = patch
  const topic = `${broker}:${symbol}`

  const add = args => {
    const parsed = props(['seed', 'bids', 'asks'])
    return db.obadd(topic, ...parsed(args))
  }

  const commit = args => {
    const parsed = juxt([ head, last ])
    return db.obcommit(topic, ...parsed(args))
  }

  return add(patch).then(commit)
}

orderbook$
  .flatMap(applyPatch)
  .subscribe(console.log)

remote.sync()
