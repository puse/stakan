import test from 'ava'

import createSubscription from '../lib/subscription'

import {
  recoverLevels,
  stampCorrelation,
  toBuffer
} from '../lib/operators'

test('connect', t => {
  t.pass()

  return createSubscription({}, 'tBTCUSD')
    .pipe(
      recoverLevels(),
      stampCorrelation(100),
      toBuffer()
    )
    .take(100)
    .map(console.log)
})
