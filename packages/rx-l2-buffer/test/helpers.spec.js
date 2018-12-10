import test from 'ava'

import { concat } from '../lib/helpers'

test('merge', t => {
  const updates = require('./assets/updates.json')
  const snapshot = require('./assets/snapshot.json')

  t.deepEqual(concat(updates), snapshot)
})
