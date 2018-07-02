import test from 'ava'

import RH from '../lib/remote/helpers'

test('symbols', t => {

  const symbol = 'btc-usd'
  const pair   = ['BTC', 'USD']

  t.deepEqual(RH.pairFromSymbol(symbol), pair)
  t.deepEqual(RH.pairToSymbol(pair), symbol)
})

