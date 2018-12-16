import test from 'ava'

import { Bids, Asks } from '..'

test('contents', t => {
  const has = key => B[key] !== void 0

  t.truthy(Bids)
  // t.truthy(Asks)
})
