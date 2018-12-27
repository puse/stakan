const getenv = require('getenv')

const R = require('ramda')

const Redis = require('@stakan/redis')

const Source = require('@stakan/source-remote-bitfinex')

const Sink = require('./lib/sink')

/**
 * Settings
 */

const SYMBOL = getenv('SYMBOL')

const TOPIC = `bitfinex/${SYMBOL}`

/**
 * Helpers
 */

/**
 * Init
 */

const db = new Redis()

const source = Source()
const sink = Sink(db, TOPIC)

source
  .observe(SYMBOL)
  // .map(R.tap(console.log))
  .subscribe(sink)
