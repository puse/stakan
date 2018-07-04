const debug = require('debug')('stakan:ob:sink')

const { Observable } = require('rxjs/Rx')

const {
  head,
  last,
  props,
  juxt,
  identity
} = require('ramda')

const Redis = require('@stakan/redis')

const {
  obadd,
  obcommit
} = require('@stakan/orderbook-db-methods')

const Source = require('@stakan/orderbook-source-cexio')

/**
 * Helpers
 */


/**
 * Init
 */

const db = new Redis()

/**
 *
 */

async function sync (patch) {
  const { broker, symbol } = patch

  const topic = `${broker}/${symbol}`

  const add = args => {
    const parsed = props(['session', 'bids', 'asks'])
    return obadd(db, patch)
  }

  const commit = args => {
    const parsed = juxt([ head, last ])
    return obcommit(db, topic, ...parsed(args))
  }

  return add(patch).then(commit)
}

Source('btc-usd')
  .retryWhen(identity)
  .flatMap(sync)
  .subscribe(console.log, identity, _ => console.log('END'))
