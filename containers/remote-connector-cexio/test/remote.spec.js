import test from 'ava'

import Remote from '../lib/remote'

import createPool from '../lib/pool'

const pool = createPool()

test('send', async t => {
  const ws = await pool.acquire()

  return Remote
    .subscribe(ws, 'btc-usd')
})
