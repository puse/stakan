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
 * Settings
 */

const SYMBOLS = ['btc-usd', 'eth-usd', 'btc-eur', 'eth-eur']

/**
 *
 */

const fromSymbol = symbol =>
  Source(symbol)
    .retry(Infinity)

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

Observable
  .from(SYMBOLS)
  .flatMap(fromSymbol)
  .flatMap(sync)
  .subscribe({
    next: identity,
    error: err => debug('Error: ', err.message),
    complete: _ => debug('Complete for %o', SYMBOLS)
  })
