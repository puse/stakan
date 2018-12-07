import test from 'ava'

import Puller from '..'

test('a', async t => {
  Puller('btc-usd')
    .subscribe(console.log)

  await new Promise(r => setTimeout(r, 5000))
  t.pass()
})
