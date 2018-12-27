import test from 'ava'

import { Level, Symbol } from '@stakan/types'

import * as C from '../lib/conversions'

test('convertSymbol', t => {
  const symbol = Symbol('btc', 'usd')
  t.is(C.convertSymbol(symbol), 'tBTCUSD')
})

test('recoverLevel', t => {
  const level = C.recoverLevel([4880, 2, -3])

  t.true(Level.is(level), 'type')

  t.deepEqual(
    level,
    Level(4880, -3),
    'value'
  )

  t.deepEqual(
    C.recoverLevel([4880, 0, -1]),
    Level(4880, 0),
    'nil value'
  )
})
