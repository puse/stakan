import test from 'ava'

import Redis from '..'

const redis = new Redis()

test('commands', t => {
  t.not(redis.l2add, undefined)
  t.not(redis.l2commit, undefined)
  t.not(redis.l2depth, undefined)
})
