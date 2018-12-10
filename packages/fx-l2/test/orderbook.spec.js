import test from 'ava'

import Orderbook from '../lib/orderbook'

test('type', t => {
  t.is(typeof Orderbook, 'function')
})
