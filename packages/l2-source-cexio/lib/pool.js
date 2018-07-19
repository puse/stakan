const debug = require('debug')('stakan:source:cexio')

const getenv = require('getenv')

const WebSocket = require('ws')

const { createPool } = require('generic-pool')

const { hmacFrom } = require('./crypto')

/**
 * Constants
 */

/**
 * CEX.IO WebSocket API URL
 */

const SERVER_URL = 'wss://ws.cex.io/ws/'

/**
 * API Credentials
 */

const CREDENTIALS = getenv.multi({
  apiKey    : ['CEXIO_API_KEY'],
  apiSecret : ['CEXIO_API_SECRET']
})

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
 * Pool config
 */

const CONFIG = {
  max: 100,
  testOnBorrow: true
}

/**
 * Helpers
 */

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
 * WS helpers
 */

const close = ws => {
  debug('Closing WS connection')

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
 * Watch
 */

const watch = ws => {

  // translate origin events
  ws.on('message', msg => {
    const { e, data, oid } = JSON.parse(msg)

    const { error } = data || {}

    if (error) {
      ws.emit('origin:error', error)
      ws.emit(`origin:${e}:error`, error)
      ws.emit(`origin:error:${oid}`, error)
    } else {
      ws.emit(`origin`, e, data, oid)
      ws.emit(`origin:${e}`, data, oid)
      ws.emit(`origin:re:${oid}`, data, e)
    }
  })

  // keep alive
  ws.on('origin:ping', _ => {
    debug('Ping received')

    const pongMsg = JSON.stringify({ e: 'pong' })
    ws.send(pongMsg)
  })

  return ws
}

/**
 * Monitor
 */

const monitor = ws => {
  const out = x => _ => debug(x)

  // debug core events
  ws.on('open', out('WS open'))
  ws.on('close', code => debug('WS closed with code %d', code))
  ws.on('error', err => debug('WS error: %s', ))

  // debug origin events
  ws.on('origin:connected', out('WS origin connected'))
  ws.on('origin:disconnecting', out('WS origin disconnecting'))

  ws.on('origin:auth', data => {
    const { error } = data

    error
      ? debug('WS origin auth error: %s', error)
      : debug('WS origin authenticated')
  })

  return ws
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

  debug('WS connecting to %s', url)

  try {
    ws = new WebSocket(url)
  } catch (err) {
    debug('WS create error: %s', err.message)

    return Promise.reject(err)
  }

  watch(ws)
  monitor(ws)

  const cb = (resolve, reject) => {
    try {
      ws.on('open', _ => resolve(ws))
    } catch (err) {
      debug('Error while connecting: %s', err.message)

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
  debug('Pool creating a WS client')

  return connect()
    .then(authenticate)
}

/**
 * Destroy
 */

async function destroy (ws) {
  debug('Pool destroying a WS client')

  const closed = resolve => {
    ws.once('close', resolve)
    close('ws')
  }

  return new Promise(closed)
}

/**
 * Validate
 */

async function validate (ws) {
  debug('Pool validation before borrow')

  const ok = isOpen(ws)

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
