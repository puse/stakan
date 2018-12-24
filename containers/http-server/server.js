const debug = require('debug')('stakan:http')

const getenv = require('getenv')

const Redis = require('@stakan/redis')

const createApp = require('./lib')

/**
 * Settings
 */

const PORT = getenv.int('NODE_PORT', 8080)

const REDIS_URL = getenv('REDIS_URL', 'redis://localhost:6379')

/**
 * Server setup
 */

const redis = new Redis(REDIS_URL)

const app = createApp(redis)

app.listen(PORT, _ => {
  console.log('Server is listening to %d', PORT)
})
