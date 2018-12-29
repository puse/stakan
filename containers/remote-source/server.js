const getenv = require('getenv')

const Redis = require('@stakan/redis')

const Source = require('./lib/source')
const Sink = require('./lib/sink')

/**
 * Settings
 */

const BROKER = getenv('BROKER')
const SYMBOL = getenv('SYMBOL')

const TOPIC = `${BROKER}/${SYMBOL}`

/**
 * Helpers
 */

/**
 * Init
 */

const db = new Redis()

const source = Source({ broker: BROKER, symbol: SYMBOL })
const sink = Sink(db, TOPIC)

source
  .observe()
  .subscribe(sink)
