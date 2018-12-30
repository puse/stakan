const getenv = require('getenv')

const Redis = require('ioredis')

const Source = require('@stakan/lymo')
const Sink = require('@stakan/omex')

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

const source = Source({}, TOPIC)

const db = new Redis(REDIS_URL)
const sink = Sink(db, TOPIC)

source.subscribe(sink)
