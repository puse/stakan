const Redis = require('ioredis')

const getenv = require('getenv')

const { map } = require('ramda')

const actions = require('./actions')

const REDIS_URL = getenv('REDIS_URL', 'redis://localhost:6379')

function Store () {
  const client = new Redis(REDIS_URL)

  return map(f => f(client), actions)
}

module.exports = Store


