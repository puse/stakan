import test from 'ava'

import C from '../lib/conversions'

test('symbol', t => {
  t.is(C.convertSymbol('btc-usd'), 'tBTCUSD', 'convert')
})

test('level', t => {
  t.deepEqual(
    C.recoverLevel([3880, 1, 0.3]),
    { price: 3880, quantity: 0.3 },
    'recover bid'
  )

  t.deepEqual(
    C.recoverLevel([3880, 1, -0.3]),
    { price: 3880, quantity: -0.3 },
    'recover ask'
  )

  t.deepEqual(
    C.recoverLevel([3880, 0, -1]),
    { price: 3880, quantity: 0 },
    'recover nil'
  )
})
