import test from 'ava'

import Redis from 'ioredis'

import {
  resetOrderBook,
  updateOrderBook,
  getOrderBook
} from '../lib/store/actions'

const client = new Redis()

test.serial('resetOrderBook', async t => {
  const SNAPSHOT = require('./assets/snapshot-formatted.json')

  await resetOrderBook(client, SNAPSHOT)

  t.pass()
})

test.serial('updateOrderBook', async t => {
  const UPDATE = require('./assets/update-formatted.json')

  const res = await updateOrderBook(client, UPDATE)

  t.not(res.seq, undefined)
})

test.serial('getOrderBook', async t => {
  const broker = 'cexio'
  const symbol = 'exo-usd'

  const res = await getOrderBook(client, { broker, symbol })

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
