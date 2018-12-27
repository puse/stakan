import test from 'ava'

import H from '../lib/remote/helpers'

test('onceThen', t => {
  const f = x => x + 1
  const g = x => x * 2

  const fn = H.onceThen(f, g)

  t.is(fn(10), 11, 'initial')
  t.is(fn(10), 20, 'second')
  t.is(fn(10), 20, 'third')
  t.is(fn(11), 22, 'rest...')
  t.is(fn(11), 22, 'rest...')
})
