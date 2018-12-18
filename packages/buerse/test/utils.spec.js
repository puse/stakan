import test from 'ava'

import U from '../lib/utils'

test('cached', t => {
  // `incr` once for each + 5 `t.is`
  // instead of 10 if not cached
  t.plan(7)

  const incr = x => {
    t.pass()
    return x + 1
  }

  const incrCached = U.cached(incr)

  t.is(incrCached(1), 2)
  t.is(incrCached(1), 2)

  t.is(incrCached(2), 3)
  t.is(incrCached(2), 3)
  t.is(incrCached(2), 3)
})
