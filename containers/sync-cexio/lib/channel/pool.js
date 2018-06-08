const debug = require('debug')('stakan:sync:cexio')

const { createPool } = require('generic-pool')

const getenv = require('getenv')

const mqtt = require('mqtt')

/**
 * Constants
 */

/**
 * Pool config
 */

const CONFIG = {
  max: 2,
  testOnBorrow: true
}

/**
 * MQTT server url
 */

const MQTT_URL = getenv('MQTT_URL', 'mqtt://localhost:1883')

/**
 * Client helpers
 */

function monitor (client) {
  client.on('error', err => {
    debug('MQTT error: %s', err.message)
  })

  client.on('connect', _ => {
    debug('MQTT client connected')
  })

  client.on('close', _ => {
    debug('MQTT client closed')
  })
}

/**
 * Factory methods
 */

/**
 * Create
 */

async function create (url = MQTT_URL) {
  debug('MQTT connecting to %s', url)

  const client = mqtt.connect(url)

  const connected = (resolve, reject) => {
    client.once('connect', resolve)
    client.once('error', reject)
  }

  return new Promise(connected)
    .then(_ => client)
}

/**
 * Destroy
 */

async function destroy (client) {
  debug('Pool destroying a mqtt client')

  const close = resolve => {
    client.end(false, resolve)
  }

  return new Promise(close)
}

/**
 * Validate
 */

async function validate (client) {
  debug('Pool validation before borrow')

  const ok = client.connected

  debug('Pool validation result: %s', ok ? 'ok': 'failed')

  return ok
}

/**
 * Pool constructor
 *
 * @param {Object} [opts] - Options for `generic-pool`
 *
 * @returns {Pool}
 */

function Pool (opts = CONFIG) {
  const factory = {
    create,
    destroy,
    validate
  }

  return createPool(factory, opts)
}

/**
 * Expose constructor
 */

module.exports = Pool

