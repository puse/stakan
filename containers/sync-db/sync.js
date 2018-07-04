const debug = require('debug')('stakan:ob:sink')

const { Observable } = require('rxjs/Rx')

const {
  head,
  last,
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
  const commit = range => {
    const parsed = juxt([ head, last ])
    return obcommit(db, patch, ...parsed(range))
  }

  return obadd(db, patch).then(commit)
}

Source('btc-usd')
  .retryWhen(identity)
  .flatMap(sync)
  .subscribe(console.log, identity, _ => console.log('END'))
