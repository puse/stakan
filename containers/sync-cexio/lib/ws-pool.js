const { createPool } = require('generic-pool')

const { createHmac } = require('crypto')

const debug = require('debug')

const getenv = require('getenv')

const WebSocket = require('ws')

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
 * CEX.IO WebSocket API URL
 */

const SERVER_URL = 'wss://ws.cex.io/ws/'

/**
 * Ready state constants
 */

const STATE_DICT = {
  'CONNECTING' : 0,
  'OPEN'       : 1,
  'CLOSING'    : 2,
  'CLOSED'     : 3
}

/**
 * Settings
 */

/**
 * API Credentials
 */

const CREDENTIALS = getenv.multi({
  apiKey    : ['CEXIO_API_KEY'],
  apiSecret : ['CEXIO_API_SECRET']
})

/**
 * Helpers
 */

const log = debug('stakan:sync:cexio')

/**
 * Create SHA256 HMAC
 *
 * @param {string} key
 * @param {string} message
 *
 * @returns {string} - hex digest
 */

const hmacFrom = (key, msg) => {
  const hmac = createHmac('sha256', key)
  hmac.update(msg)

  return hmac.digest('hex')
}

/**
 * CEX.IO specific `auth` object
 *
 * @param {Object} creds
 * @param {string} creds.apiKey
 * @param {string} creds.apiSecret
 *
 * @returns {Object}
 */

const authFrom = (creds = CREDENTIALS) => {
  // rename to usable keys
  const {
    apiKey    : key,
    apiSecret : secret
  } = creds

  const timestamp = Math.floor(Date.now() / 1000)

  const signature = hmacFrom(secret, timestamp + key)

  return {
    key,
    signature,
    timestamp
  }
}

/**
 * Message contructor
 *
 * @param {string} e - scope identifier
 * @param {Object} data - payload of message
 * @param {string} [oid] - callback identifier
 *
 * @returns {string} - Stringified message ready to send
 */

const messageOf = (e, data, oid) => {
  const payload = {
    e,
    data,
    oid
  }

  return JSON.stringify(payload)
}

/**
 * WS helpers
 */

const close = ws => {
  log('Closing WS connection')
  ws.close(1000, 'Expired')
}

/**
 * Check if open
 *
 * @param {WebSocket} ws
 *
 * @returns {boolean}
 */

const isOpen = ws =>
  ws.readyState === STATE_DICT['OPEN']

/**
 * Send heartbeat to origin
 */

const keepAlive = ws => {
  const pong = _ => ws.send(messageOf('pong'))
  ws.on('origin:ping', pong)
}

/**
 * Monitor
 */

const monitor = ws => {
  const out = x => _ => log(x)

  // translate origin events
  ws.on('message', msg => {
    const { e, data, oid } = JSON.parse(msg)

    const { error } = data || {}
    if (error) ws.emit('origin:error', error)

    ws.emit(`origin:${e}`, data, oid)
    ws.emit(`origin:re:${oid}`, data, e)
  })

  // debug core events
  ws.on('open', out('WS open'))
  ws.on('close', code => log('WS closed with code %d', code))
  ws.on('error', err => log('WS error: %s', ))

  // debug origin events
  ws.on('origin:connected', out('WS origin connected'))
  ws.on('origin:disconnecting', out('WS origin disconnecting'))

  ws.on('origin:auth', data => {
    const { error } = data

    error
      ? log('WS origin auth error: %s', error)
      : log('WS origin authenticated')
  })
}

/**
 * Methods
 */

/**
 * Create a connected client
 *
 * @param {string} [url]
 *
 * @returns {WebSocket}
 */

async function connect (url = SERVER_URL) {
  let ws

  try {
    log('WS connecting to %s', url)
    ws = new WebSocket(url)
  } catch (err) {
    log('WS create error: %s', err.message)
    return Promise.reject(err)
  }

  monitor(ws)
  keepAlive(ws)

  const cb = (resolve, reject) => {
    try {
      ws.on('open', _ => resolve(ws))
    } catch (err) {
      log('Error while connecting: %s', err.message)
      reject(err)
    }
  }

  return new Promise(cb)
}

/**
 *
 */

async function authenticate (ws) {
  const msg = JSON.stringify({
    e: 'auth',
    auth: authFrom(CREDENTIALS)
  })

  const cb = (resolve, reject) => {
    ws.once('origin:auth', ({ error }) => {
      if (!error) return resolve(ws)

      close(ws)
      reject(new Error(error))
    })

    ws.send(msg)
  }

  return new Promise(cb)
}

/**
 * Factory methods
 */

/**
 * Create
 */

async function create () {
  log('Pool creating a WS client')

  return connect()
    .then(authenticate)
}

/**
 * Destroy
 */

async function destroy (ws) {
  log('Pool destroying a WS client')
  const close = resolve => {
    ws.once('close', resolve)
    close('ws')
  }

  return new Promise(close)
}

/**
 * Validate
 */

async function validate (ws) {
  log('Pool validation before borrow')

  const ok = isOpen(ws)

  log('Pool validation result: %s', ok ? 'ok': 'failed')

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
