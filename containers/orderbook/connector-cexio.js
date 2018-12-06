const { Observable } = require('rxjs/Rx')

const Redis = require('@stakan/redis')

const Source = require('@stakan/l2-source-cexio')

const Subscribe = require('./lib/subscriber-db')

/**
 * Settings
 */

const SYMBOLS = [
  'btc-usd',
  'eth-usd',
  // 'btc-eur',
  // 'eth-eur'
]

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

Observable
  .from(SYMBOLS)
  .flatMap(fromSymbol)
  .subscribe(Subscribe(db))
