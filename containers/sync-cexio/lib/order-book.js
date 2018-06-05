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
 * Compile a subscribe message
 */

const subscribeMsgFrom = ({ symbol, depth }, oid) => {
  const pair = symbol
    .toUpperCase()
    .split('-')

  const payload = {
    e: 'order-book-subscribe',
    data: {
      pair,
      depth,
      subscribe: true
    },
    oid
  }

  return JSON.stringify(payload)
}

/**
 *
 */

const pool = createPool()

/**
 *
 */

class OrderBook extends EventEmitter {
  constructor (opts = {}) {
    super()

    const { depth = 20 } = opts

    this.broker = 'cexio'

    this.depth = depth
  }

  get nextId () {
    return ++this.id
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

  monitor () {
    const { ws } = this

    const snapshot = this.snapshot.bind(this)
    const update   = this.update.bind(this)

    ws.on('origin:order-book-subscribe', snapshot)
    ws.on('origin:md_update', update)
  }

  async connect (symbol) {
    this.ws = await pool.acquire()
    this.emit('connected')
  }

  async subscribe (symbol) {
    const { ws } = this

    this.symbol = symbol

    this.monitor()

    const subscribe = resolve => {
      const oid = 'OB_OID:' + Date.now()
      const msg = subscribeMsgFrom(this, oid)

      ws.on(`origin:re:${oid}`, resolve)
      ws.send(msg)
    }

    return new Promise(subscribe)
  }

  static of (symbol) {

  }
}


async function run () {
  const ob = new OrderBook()

  ob.on('update', console.log)

  await ob.connect()
  await ob.subscribe('btc-usd')

  console.log('go')
}

run()
