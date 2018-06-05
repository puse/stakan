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

const messageFrom = (e, data, oid) => {
  const payload = {
    e,
    data,
    oid
  }

  return JSON.stringify(payload)
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
  log('Connecting to %s', url)

  const ws = new WebSocket(url)

  const cb = (resolve, reject) => {
    const openHandler = _ => {
      log('WS connected')
      resolve(ws)
    }

    try {
      ws.on('open', openHandler)
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
  const e = 'auth'
  const auth = authFrom(CREDENTIALS)

  const msg = JSON.stringify({ e, auth })

  log('Authenticating WS connection')

  const cb = (resolve, reject) => {
    const authHandler = msg => {
      const { e, ok } = JSON.parse(msg)

      // skip irrelevent messages
      if (e !== 'auth') return void 0

      ws.removeListener('message', authHandler)

      if (ok === 'ok') {
        log('Authenticated succesfully')
        resolve(ws)
      } else {
        const message = 'Not authenticated'
        const err = new Error(message)

        log(message)
        resolve(err)
      }
    }

    ws.on('message', authHandler)

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
  return connect()
    .then(authenticate)
}

/**
 * Destroy
 */

async function destroy (ws) {
  log('Closing WS')

  const close = resolve => {
    ws.on('close', resolve)
    ws.close(1000, 'Expired')
  }

  return new Promise(close)
}

/**
 * Validate
 */

async function validate (ws) {
  log('Validating before borrow')

  const ok = ws.readyState = STATE_DICT['OPEN']

  log('Validation result: %s', ok ? 'ok': 'failed')

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
