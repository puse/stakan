const debug = require('debug')('stakan:ob:sink')

const { Observable } = require('rxjs/Rx')

const {
  head,
  last,
  props,
  juxt,
  identity
} = require('ramda')

const OrderbookDB = require('@stakan/orderbook-db')

const Source = require('@stakan/orderbook-source-cexio')

/**
 * Helpers
 */


/**
 * Init
 */

const db = new OrderbookDB()

/**
 *
 */

async function sync (patch) {
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

Source('btc-usd')
  .retryWhen(identity)
  .map(sync)
  .subscribe(console.log, identity, _ => console.log('END'))
