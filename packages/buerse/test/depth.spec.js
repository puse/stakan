import test from 'ava'

import * as R from 'ramda'

import Side from '../lib/internal/depth.side'
import Depth, { Bids, Asks } from '../lib/depth'

const xs = [
  [ 50, 1 ],
  [ 70, 1 ],
  [ 60, 1 ]
]

const xsNext = [
  [ 70, 2 ],
  [ 75, 3 ],
  [ 50, 0 ]
]

test('Bids', t => {
  const bids = new Bids(xs)

  t.true(bids instanceof Bids, 'type')
  t.true(bids instanceof Side, 'type')

  t.deepEqual(
    bids.valueOf(),
    [ [ 70, 1 ],
      [ 60, 1 ],
      [ 50, 1 ] ],
    'sorted descending'
  )
})

test('Asks', t => {
  const asks = new Asks(xs)

  t.true(asks instanceof Asks, 'type')
  t.true(asks instanceof Side, 'type')

  t.deepEqual(
    asks.valueOf(),
    [ [ 50, 1 ],
      [ 60, 1 ],
      [ 70, 1 ] ],
    'sorted ascending'
  )
})
