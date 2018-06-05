const { EventEmitter } = require('events')

const assert = require('assert')

const {
  isNil
} = require('ramda')

const createPool = require('./ws-pool')

/**
 * Helpers
 */

const shouldThrow = err => {
  if (!err instanceof Error) {
    err = new Error(err)
  }

  throw err
}

/**
 * Actions
 */

async function subscribe (ws, { pair, depth }) {
  const e = 'order-book-subscribe'
  const oid = 'OB_OID:' + Date.now()

  const data = {
    pair,
    depth,
    subscribe: true
  }

  const msg = JSON.stringify({ e, data, oid })

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
  const e = 'order-book-unsubscribe'
  const oid = 'OB_OID:' + Date.now()

  const data = {
    pair
  }

  const msg = JSON.stringify({ e, data, oid })

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

    ws.close(1000, 'Unsubscribed')

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

  console.log('go')
}

run()
