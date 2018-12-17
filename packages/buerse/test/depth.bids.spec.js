import test from 'ava'

import Side from '../lib/internal/depth.side'
import Bids from '../lib/depth.bids'

const xs = [
  [ 50, 1 ],
  [ 70, 1 ],
  [ 60, 1 ]
]

test('constructor', t => {
  const bids = new Bids(xs)

  t.true(bids instanceof Bids, 'type')
  t.true(bids instanceof Side, 'type')
})

test('sort', t => {
  const bids = new Bids(xs)

  t.deepEqual(
    bids.valueOf(),
    [ [ 70, 1 ],
      [ 60, 1 ],
      [ 50, 1 ] ],
    'descending'
  )
})
