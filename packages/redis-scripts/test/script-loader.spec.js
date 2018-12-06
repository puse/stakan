import test from 'ava'

import loader from '../lib/loader'

test('basic', async t => {
  const load = loader(__dirname)
  const a = load('assets/a')

  t.pass()
})
