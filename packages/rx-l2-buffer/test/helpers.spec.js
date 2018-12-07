import test from 'ava'

import * as H from '../lib/helpers'

const updates = require('./assets/updates.json')
const snapshot = require('./assets/snapshot.json')

test('pack', t => {
  const { rows } = updates[1]

  const packed =
    { bids: { '4999': 0.9, '5000': 0  },
      asks: { '5001': 0.8  } }

  t.deepEqual(
    H.pack(rows),
    packed
  )

  // t.deepEqual(
  //   H.unpack(packed),
  //   rows
  // )
})

test('merge', t => {
  t.deepEqual(
    H.mergeUpdates(updates),
    snapshot
  )
})
