const debug = require('debug')('stakan:sync:cexio')

const { EventEmitter } = require('events')

const assert = require('assert')

const {
  isNil,
  merge,
  map,
  zipObj
} = require('ramda')

const createPool = require('./pool')

/**
 * Helpers
 */

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
 * Snapshot parser
 */

const recoverEntries = map(zipObj(['price', 'amount']))

/**
 * Actions
 */

/**
 *
 */

async function subscribe (ws, { pair, depth }) {
  const data = {
    pair,
    depth,
    subscribe: true
  }

  const subscribe = (resolve, reject) => {
    const oid = 'ob:' + Date.now()

    const msg = messageOf('order-book-subscribe', data, oid)

    const topic = `origin:re:${oid}`

    ws.on(topic, resolve)
    ws.on(`${topic}:error`, reject)

    ws.send(msg)
  }

  return new Promise(subscribe)
}

/**
 *
 */

async function unsubscribe (ws, { pair }) {

  const data = {
    pair
  }

  const unsubscribe = resolve => {
    const oid = 'ob:' + Date.now()

    const msg = messageOf('order-book-unsubscribe', data, oid)

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

class Remote extends EventEmitter {
  constructor (symbol, opts = {}) {
    super()

    const { depth = 20 } = opts

    this.broker = 'cexio'
    this.symbol = symbol

    this.depth  = depth

    this.reset  = this.reset.bind(this)
    this.update = this.update.bind(this)
    this.reject = this.reject.bind(this)
    this.sync   = this.sync.bind(this)
    this.stop   = this.stop.bind(this)
    this.close  = this.close.bind(this)

    this.on('error', this.stop)
  }

  get nextId () {
    return ++this.id
  }

  get pair () {
    return this.symbol
      .toUpperCase()
      .split('-')
  }

  close () {
    this.debug('closing')
    this.emit('close')

    this.removeAllListeners()

    this.ws = null
  }

  publish (data = {}) {
    const { seed, broker, symbol } = this

    const { bids, asks } = data

    const payload = {
      seed,
      broker,
      symbol,
      asks: recoverEntries(asks),
      bids: recoverEntries(bids)
    }

    this.emit('patch', payload)
  }

  debug (msg, ...args) {
    const { symbol } = this
    debug(`Remote (%s) ${msg}`, symbol, ...args)
  }

  watch () {
    const { ws } = this

    // keep alive
    ws.on('origin:ping', _ => {
      this.debug('keep alive')
      ws.send(messageOf('pong'))
    })

    ws.on('origin:disconnecting', this.close)

    try {
      ws.on('origin:order-book-subscribe', this.reset)
      ws.on('origin:md_update', this.update)
    } catch (err) {
      this.debug('error: %s', err)
      this.emit('error', err)

      this.stop()
    }
  }

  reset (data) {
    const { id, bids, asks } = data

    this.id = id
    this.seed = Date.now()

    this.debug('snapshot received')
    this.publish({ bids, asks })
  }

  update (data) {
    const { id, bids, asks } = data

    assert(id === this.nextId, 'Inconsistent sequence')

    this.publish({ bids, asks })
  }

  async reject (err) {
    err = err instanceof Error
      ? err
      : new Error(err)

    this.debug('error: %s', err.message)
    this.emit('error', err)

    await this.stop()

    return Promise.reject(err)
  }

  async sync (opts = {}) {
    this.depth = opts.depth || this.depth

    const start = ws => {
      this.ws = ws

      this.debug('connected')
      this.emit('connected')

      this.subscribe()
      this.watch()

      return this
    }

    return  pool
      .acquire()
      .then(start)
  }

  async subscribe () {
    const { ws } = this

    const op = _ => {
      this._subscribed = true

      this.debug('subscribed')
      this.emit('subscribed')
    }

    return subscribe(ws, this)
      .then(op)
      .catch(this.reject)
  }

  async unsubscribe () {
    const { ws } = this

    const op = _ => {
      this._subscribe = false

      this.debug('unsubscribed')
      this.emit('unsubscribed')
    }

    return unsubscribe(ws, this)
      .then(op)
      .catch(this.reject)
  }

  async stop () {
    await this.unsubscribe()

    await pool.release(ws)

    return this.close()
  }

  static of (symbol, opts) {
    return new Remote(symbol, opts)
  }
}

/**
 * Expose
 */

module.exports = Remote
