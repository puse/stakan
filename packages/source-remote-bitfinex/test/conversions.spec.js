import test from 'ava'

import { Symbol, Level } from '../lib/conversions'

test('convertSymbol', t => {
  t.is(Symbol.convert('btc-usd'), 'tBTCUSD')
})

test('recoverLevel', t => {
  t.deepEqual(
    Level.recover([4880, 2, -3]),
    { price: 4880, quantity: -3 },
    'value'
  )

  t.deepEqual(
    Level.recover([4880, 0, -1]),
    { price: 4880, quantity: 0 },
    'nil value'
  )
})
