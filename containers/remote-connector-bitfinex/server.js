const getenv = require('getenv')

const { Observable } = require('rxjs/Rx')

const Bfx = require('bitfinex-api-node')

const Redis = require('@stakan/redis')

const {
  l2add,
  l2commit
} = require('@stakan/db-methods')

const Subscription = require('./lib/subscription')

const { convertSymbol } = require('./lib/conversions')

const compat = require('./compat')

/**
 * Settings
 */

const SYMBOL = getenv('SYMBOL')

const SETTINGS = {
  ws: {
    autoReconnect: false,
    seqAudit: true,
    packetWDDelay: 10 * 1000
  }
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

const bfx = new Bfx(SETTINGS)

Subscription(bfx.ws(), convertSymbol(SYMBOL))
  .pipe(recover)
  .subscribe(consume)
