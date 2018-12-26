const getenv = require('getenv')

const R = require('ramda')

const Redis = require('@stakan/redis')

const Remote = require('@stakan/source-remote-bitfinex/lib/remote')

const {
  l2add,
  l2commit
} = require('@stakan/db-methods')

const compat = require('./compat')

/**
 * Settings
 */

const SYMBOL = getenv('SYMBOL')

/**
 * Helpers
 */

const convertSymbol = symbol => {
  // btc-usd -> [btc, usd]
  const toPair = R.split('-')
  // [btc, usd] -> [BTC, USD]
  const toUpperEach = R.map(R.toUpper)
  // [BTC, USD] -> BTCUSD
  const join = R.reduce(R.concat, '')
  // BTCUSD -> tBTCUSD
  const prefix = R.concat('t')

  const convert = R.compose(prefix, join, toUpperEach, toPair)

  return convert(symbol)
}

/**
 * Init
 */

const db = new Redis()

const consume = patch => {
  const { session, rows } = patch

  const add = _ => {
    return l2add(db, patch, session, rows)
  }

  const commit = _ => {
    return l2commit(db, patch)
  }

  return add().then(commit)
}

/**
 *
 */

const recover = compat({
  broker: 'bitfinex',
  symbol: SYMBOL
})

Remote()
  .observe(convertSymbol(SYMBOL))
  .pipe(recover)
  .subscribe(consume)
