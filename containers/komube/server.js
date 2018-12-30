const getenv = require('getenv')

const Redis = require('ioredis')

const Source = require('./lib/source')
const Sink = require('./lib/sink')

/**
 * Settings
 */

const REDIS_URL = getenv('REDIS_URL', 'redis://localhost:6379')

const TOPIC = getenv.multi({
  broker: 'BROKER',
  symbol: 'SYMBOL'
})

/**
 * Helpers
 */

/**
 * Init
 */

const db = new Redis(REDIS_URL)

const source = Source(TOPIC)
const sink = Sink(db, TOPIC)

source
  .observe()
  .subscribe(sink)
