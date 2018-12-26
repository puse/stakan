import test from 'ava'

import { Symbol, Level } from '../lib/types'

test('Symbol', t => {
  const symbol = Symbol.fromString('btc-usd')

  t.is(symbol.base, 'btc')
  t.is(symbol.quote, 'usd')

  t.is(symbol.toString(), 'btc-usd')

  t.is(symbol.toString('bitfinex'), 'tBTCUSD')
})

test('Level', t => {
  const level = Level.fromBitfinex([4880, 2, -3])

  t.is(level.price, 4880)
  t.is(level.quantity, -3)
})
