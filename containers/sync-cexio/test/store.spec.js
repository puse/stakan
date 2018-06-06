import test from 'ava'

import Redis from 'ioredis'

import Store from '../lib/store'

const store = new Store()

test.serial('resetOrderBook', async t => {
  const SNAPSHOT = require('./assets/snapshot-formatted.json')

  await store.resetOrderBook(SNAPSHOT)

  t.pass()
})

test.serial('updateOrderBook', async t => {
  const UPDATE = require('./assets/update-formatted.json')

  const res = await store.updateOrderBook(UPDATE)

  t.not(res.seq, undefined)
})

test.serial('getOrderBook', async t => {
  const broker = 'cexio'
  const symbol = 'exo-usd'

  const res = await store.getOrderBook({ broker, symbol })

  t.not(res.ts, undefined)

  t.is(res.broker, broker)
  t.is(res.symbol, symbol)

  t.deepEqual(res.bids, [
    [ 100, 2 ],
    [ 95, 2 ],
    [ 85, 1 ]
  ])

  t.deepEqual(res.asks, [
    [ 105, 2 ],
    [ 115, 1 ]
  ])
})
