import test from 'ava'

import * as H from '../lib/remote/helpers'

test('symbol helpers', t => {
  t.is(H.symbolToPair('btc-usd'), 'tBTCUSD')
  t.is(H.symbolFrom('tBTCUSD'), 'btc-usd')
})

test('row helpers', t => {
  t.deepEqual(
    H.rowFrom([3542, 3, 3.6]),
    { side: 'bids',
      price: 3542,
      amount: 3.6 },
    'count > 0, amount > 0: add to bids'
  )

  t.deepEqual(
    H.rowFrom([3550,1,-0.3]),
    { side: 'asks',
      price: 3550,
      amount: 0.3 },
    'count > 0, amount < 0: add to asks'
  )

  t.deepEqual(
    H.rowFrom([3539.3, 0, 1]),
    { side: 'bids',
      price: 3539.3,
      amount: 0 },
    'count = 0, amount > 0: remove from bids'
  )

  t.deepEqual(
    H.rowFrom([3539.3, 0, -1]),
    { side: 'asks',
      price: 3539.3,
      amount: 0 },
    'count = 0, amount < 0: remove from asks'
  )
})

test('recover', t => {
  const symbol = 'btc-usd'
  const session = 1

  const recover = H.patchFromSnapshot(symbol, session)

  t.is(typeof recover, 'function')

  const snapshot = [
    [3552.5,1,-0.002],
    [3552.9,1,-1.44479053],
    [3553,1,-1],
    [3553.2,1,-1.52470789],
    [3554.7,1,-0.35],
    [3554.8,4,-8.30597384]
  ]

  const res = recover(snapshot)

  t.true(Array.isArray(res.rows))
})
