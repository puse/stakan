import test from 'ava'

import { send, subscribe } from '../lib/remote'

import createPool from '../lib/pool'

const pool = createPool()

test('subscribe', async t => {
  const ws = await pool
    .acquire()

  t.plan(2)

  await t.throws(subscribe(ws, 'btc-xxx'))

  await subscribe(ws, 'btc-usd')
    .then(_ => t.pass())
})

test('send', async t => {
  const ws = await pool
    .acquire()

  const ping = resolve => {
    ws.on('origin:pong', resolve)

    send(ws, { event: 'ping' })
  }

  await new Promise(ping)
    .then(_ => t.pass())
})
