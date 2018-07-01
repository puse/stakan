const { Observable } = require('rxjs/Rx')

const {
  head,
  last,
  props,
  juxt,
  identity
} = require('ramda')

const OrderbookDB = require('@stakan/orderbook-db')

const Connector = require('./lib/client')

/**
 * Helpers
 */

const topicOf = ({ broker, symbol }) =>
  `${broker}:${symbol}`

/**
 * Init
 */

const db = new OrderbookDB()
const remote = new Connector('btc-usd')

/**
 * Signals
 */

const close$ = Observable
  .fromEvent(remote, 'close')

const patch$ = Observable
  .fromEvent(remote, 'patch')
  .takeUntil(close$)

/**
 *
 */

async function applyPatch (patch) {
  const { broker, symbol } = patch

  const topic = `${broker}/${symbol}`

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

patch$
  .flatMap(applyPatch)
  .subscribe(identity, identity, _ => console.log('END'))

remote.sync()
