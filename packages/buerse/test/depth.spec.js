import test from 'ava'

import * as R from 'ramda'

import Depth from '../lib/depth'
import { Bids, Asks } from '../lib/depth.side'

const bids = [
  [ 99, 1 ],
  [ 100, 1 ]
]

const asks = [
  [ 101, 1 ],
  [ 102, 1 ]
]

test('constructor', t => {
  t.is(typeof Depth, 'function')

  const depth = new Depth(bids, asks)

  t.true(depth.bids instanceof Bids)
  t.true(depth.asks instanceof Asks)
})

test('valueOf', t => {
  const depth = new Depth(bids, asks)

  t.deepEqual(
    depth.valueOf(),
    {
      bids: [
        [ 100, 1 ],
        [ 99, 1 ]
      ],
      asks: [
        [ 101, 1 ],
        [ 102, 1 ]
      ]
    }
  )
})

// Setoid
test('equals', t => {
  const a = new Depth(bids, asks)
  const b = new Depth(bids, asks)
  const c = new Depth(bids, asks)

  t.true(a.equals(a), 'reflexivity')
  t.is(a.equals(b), b.equals(a), 'symmetry')
  t.is(a.equals(b) && b.equals(c), a.equals(c), 'transitivity')
})

// Semigroup
test('concat', t => {
  const depth = new Depth(bids, asks)
  const depthNext = new Depth([[100, 0]], [[102, 2]])
  const depthExt = new Depth([[ 98, 3 ]], [])

  t.true(depth.concat(depthNext) instanceof Depth, 'type')

  t.true(
    R.equals(
      depth.concat(depthNext),
      new Depth(
        [ [99, 1],
          [100, 0] ],
        [ [101, 1],
          [102, 2] ]
      )
    ),
    'value'
  )

  t.true(
    R.equals(
      depth.concat(depthNext).concat(depthExt),
      depth.concat(depthNext.concat(depthExt))
    ),
    'associativity'
  )
})

// Monoid
test('empty', t => {
  const depth = new Depth(bids, asks)
  const empty = Depth.empty()

  t.true(empty instanceof Depth, 'type')

  t.true(R.equals(empty, new Depth([], [])), 'value')

  t.true(
    R.equals(
      depth.concat(empty),
      depth
    ),
    'right identity'
  )

  t.true(
    R.equals(
      empty.concat(depth),
      depth
    ),
    'left identity'
  )
})

// Bifunctor
test('bimap', t => {
  const depth = new Depth(bids, asks)

  const incrBy = x => ([p, q]) => ([p, q + x])

  t.true(
    depth
      .bimap(R.identity, R.identity)
      .equals(depth),
    'identity'
  )

  t.true(
    depth
      .bimap(incrBy(2), incrBy(2))
      .bimap(incrBy(1), incrBy(1))
      .equals(depth.bimap(incrBy(3), incrBy(3))),
    'composition'
  )

  t.deepEqual(
    depth.bimap(incrBy(1), incrBy(2)).valueOf(),
    {
      bids: [
        [ 100, 2 ],
        [ 99, 2 ]
      ],
      asks: [
        [ 101, 3 ],
        [ 102, 3 ]
      ]
    },
    'value'
  )
})
