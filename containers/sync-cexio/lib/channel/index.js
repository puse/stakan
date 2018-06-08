const debug = require('debug')('stakan:sync:cexio')

const { Subject } = require('rxjs/Rx')

const createPool = require('./pool')

/**
 * Settings
 */

const PREFIX = 'orderbook'

/**
 * Setup pool
 */

const pool = createPool()

/**
 * Methods
 */

async function publish (client, payload) {
  const { broker, symbol } = payload

  const topic = `${PREFIX}/${broker}/${symbol}`
  const message = JSON.stringify(payload)

  const options = {
    qos: 2
  }

  const sent = (resolve, reject) => {
    const cb = err => {
      err
        ? reject(err)
        : resolve()
    }

    client.publish(topic, message, options, cb)
  }

  return new Promise(sent)
}

async function tearDown (client) {
  debug('Channel is disconnecting')

  return pool.release(client)
}

function asObserver (client) {
  const next = payload =>
    publish(client, payload)

  const error = err => {
    debug('Channel error: %s', err.message)
    tearDown(client)
  }

  const complete = _ => {
    debug('Completed')
    tearDown(client)
  }

  return { next, error, complete }
}

function Channel () {
  const subject = new Subject()

  const subscribe = client => {
    const next = payload =>
      publish(client, payload)

    const error = err => {
      debug('Channel error: %s', err.message)
      tearDown(client)
    }

    const complete = _ =>
      tearDown(client)

    return subject.subscribe(next, error, complete)
  }

  pool
    .acquire()
    .then(subscribe)

  return subject
}

module.exports = Channel
