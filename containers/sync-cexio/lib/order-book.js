const { EventEmitter } = require('events')

const assert = require('assert')

const {
  isNil
} = require('ramda')

const createPool = require('./ws-pool')

/**
 * Helpers
 */

/**
 * Throw errors
 *
 * @param {Error|string} err
 *
 * @returns {Error}
 */

const shouldThrow = err => {
  if (!err instanceof Error) {
    err = new Error(err)
  }

  throw err
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
 * Actions
 */

/**
 *
 */

async function subscribe (ws, { pair, depth }) {
  const oid = 'OB_OID:' + Date.now()

  const data = {
    pair,
    depth,
    subscribe: true
  }

  const msg = messageOf('order-book-subscribe', data, oid)

  const subscribe = resolve => {
    ws.on(`origin:re:${oid}`, resolve)
    ws.send(msg)
  }

  return new Promise(subscribe)
}

/**
 *
 */

async function unsubscribe (ws, { pair }) {
  const oid = 'OB_OID:' + Date.now()

  const data = {
    pair
  }

  const msg = messageOf('order-book-unsubscribe', data, oid)

  const unsubscribe = resolve => {
    ws.on(`origin:re:${oid}`, resolve)
    ws.send(msg)
  }

  return new Promise(unsubscribe)
}

/**
 *
 */

const pool = createPool()

/**
 *
 */

class OrderBook extends EventEmitter {
  constructor (symbol, opts = {}) {
    super()

    const { depth = 20 } = opts

    this.broker = 'cexio'
    this.symbol = symbol

    this.depth  = depth

    this.snapshot = this.snapshot.bind(this)
    this.update   = this.update.bind(this)
  }

  get nextId () {
    return ++this.id
  }

  get pair () {
    return this.symbol
      .toUpperCase()
      .split('-')
  }

  update (data) {
    const { id, bids, asks } = data

    assert(id === this.nextId, 'Inconsistent sequence')

    this.emit('update', { bids, asks })
  }

  snapshot (data) {
    const { id, bids, asks } = data

    this.id = id

    this.emit('snapshot', { bids, asks })
  }

  async sync (opts = {}) {
    this.depth = opts.depth || this.depth

    this.ws = await pool.acquire()
    this.emit('connected')

    const { ws } = this

    // monitor
    try {
      ws.on('origin:error', shouldThrow)

      ws.on('origin:order-book-subscribe', this.snapshot)
      ws.on('origin:md_update', this.update)
    } catch (err) {
      this.emit('error', err)
      this.stop()
    }

    // subscribe
    await subscribe(ws, this)
    this.emit('subscribed')

    return this
  }

  async stop () {
    const { ws } = this

    await unsubscribe(ws, this)
    this.emit('unsubscribed')

    await pool.release(ws)
    this.emit('disconnected')
  }

  static of (symbol, opts) {
    return new OrderBook(symbol, opts)
  }
}


async function run () {
  const ob = new OrderBook('btc-usd')

  ob.on('update', console.log)

  await ob.sync()

  setTimeout(_ => ob.stop(), 2000)
}

run()
