import test from 'ava'

import Depth from '../lib/depth'

test('constructor', t => {
  t.is(typeof Depth, 'function')

  const depth = new Depth()

  t.not(depth.bids, undefined)
  t.not(depth.asks, undefined)
})
