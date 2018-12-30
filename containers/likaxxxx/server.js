const getenv = require('getenv')

const Redis = require('ioredis')

const Source = require('@stakan/lika')
const Sink = require('@stakan/akay')

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

const sink = Sink(db, TOPIC)

console.log(TOPIC)

Source({}, TOPIC)
  .subscribe(sink)
