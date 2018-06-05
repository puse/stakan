const { EventEmitter } = require('events')

const WebSocket = require('ws')

const { createHmac } = require('crypto')

const getenv = require('getenv')

/**
 * Constants
 */

const STATES = {
  'OPEN': 1
}

/**
 * Settings
 */

const WS_URL = getenv('CEXIO_WS_URL', 'wss://ws.cex.io/ws/')

const CREDS = getenv.multi({
  apiKey    : ['CEXIO_API_KEY'],
  apiSecret : ['CEXIO_API_SECRET']
})

/**
 * Helpers
 */

const hmacFrom = (key, msg) => {
  const hmac = createHmac('sha256', key)
  hmac.update(msg)

  return hmac.digest('hex')
}

const createAuthMsgFrom = ({ apiKey, apiSecret }) => {
  const e = 'auth'

  const timestamp = Math.floor(Date.now() / 1000)

  const signature = hmacFrom(apiSecret, timestamp + apiKey)

  const auth = {
    key: apiKey,
    timestamp,
    signature
  }

  return JSON.stringify({ e, auth })
}

/**
 * Methods
 */

const isReady = ws =>
  ws.readyState === STATES['OPEN']

/**
 *
 */

class Client extends EventEmitter {
  constructor () {
    super()
  }

  connect (url = WS_URL) {
    const ws = new WebSocket(url)

    const connected = (resolve, reject) => {
      try {
        ws.on('open', resolve)
      } catch (err) {
        reject(err)
      }
    }

    this._ws = ws

    return new Promise(connected)
      .then(_ => this.delegate())
  }

  send (payload) {
    const ws = this._ws

    const msg = JSON.stringify(payload)

    ws.send(msg)
  }

  pong () {
    const ws = this._ws

    const e = 'pong'

    this.send({ e })
  }

  delegate () {
    const ws = this._ws

    ws.on('message', msg => {
      const { e, data, oid } = JSON.parse(msg)

      if (e === 'ping') {
        this.emit('ping')
        this.pong()
      }

      console.log(e)

      this.emit(e, data)
    })
  }

  authenticate (creds = CREDS) {
    const ws = this._ws

    const msg = createAuthMsgFrom(creds)

    const auth = (resolve, reject) => {
      ws.send(msg)

      const handler = msg => {
        const { e, ok } = JSON.parse(msg)

        // skip irrelevent messages
        if (e !== 'auth') return void 0

        ws.removeListener('message', handler)

        return ok === 'ok'
          ? resolve()
          : reject()
      }

      ws.on('message', handler)
    }

    return new Promise(auth)
  }

  subscribe (symbol, depth = 0) {
    const pair = symbol
      .toUpperCase()
      .split('-')

    const data = {
      pair,
      depth,
      subscribe: true
    }

    this.send({
      e: 'order-book-subscribe',
      data
    })
  }
}

const client = new Client()

client
  .connect()
  .then(_ => console.log('connected'))
  .then(_ => client.authenticate())
  .then(_ => console.log('authenticated'))
  .then(_ => client.subscribeOB('btc-usd'))
  .then(console.log)
  .catch(console.error)

client.on('order-book-subscribe', console.log)
