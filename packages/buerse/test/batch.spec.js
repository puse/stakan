import test from 'ava'

import * as R from 'ramda'

import Batch from '../lib/batch'
import { Bid, Ask, Nil } from '../lib/level'

// Helpers

const equalEntries = (a, b) => R.equals(a.entries, b.entries)
const equalIterable = (a, b) => R.equals([...a], [...b])

// Assets

const xs = [
  Bid(200, 1),
  Bid(205, 1),
  Ask(210, 1),
  Ask(220, 1)
]

const xsNext = [
  Nil(200),
  Bid(205, 2),
  Ask(215, 2)
]

const xsExt = [
  Bid(210, 3)
]

// Tests

test('constructor', t => {
  const batch = Batch(xs)

  t.true(Batch.is(batch), 'type')

  t.deepEqual(batch.entries, xs, 'value')
})

test('toArray', t => {
  t.deepEqual(
    Batch([...xs, ...xsNext]).toArray(),
    [ xsNext[0],
      xsNext[1],
      xs[2],
      xs[3],
      xsNext[2] ]
  )
})

test('iterator', t => {
  t.deepEqual([...new Batch(xs)], xs)
})

// Semigroup
test('concat', t => {
  const batch = Batch(xs)
  const batchNext = Batch(xsNext)
  const batchExt = Batch(xsExt)

  // Laws
  t.true(
    equalEntries(
      batch.concat(batchNext).concat(batchExt),
      batch.concat(batchNext.concat(batchExt))
    ),
    'associativity'
  )

  // Behavior

  t.true(
    equalEntries(
      batch.concat(batchNext),
      Batch([...xs, ...xsNext])
    ),
    'Batch(a) ++ Batch(b) == Batch(a++b)'
  )
})

// Monoid
test('empty', t => {
  const batch = Batch(xs)
  const empty = Batch.empty()

  // Laws

  t.true(
    equalEntries(
      batch.concat(empty).entries,
      batch.entries
    ),
    'right identity'
  )

  t.true(
    equalEntries(
      empty.concat(batch),
      batch
    ),
    'left identity'
  )
})

// Functor
test('map', t => {
  const batch = Batch(xs)

  const f = x => x.cata({
    Bid: (p, q) => Bid(p + 1, q),
    Ask: (p, q) => Ask(p + 2, q)
  })

  const g = x => x.cata({
    Bid: (p, q) => Bid(p, q * 2),
    Ask: (p, q) => Ask(p, q * 2)
  })

  t.true(
    equalIterable(
      batch.map(R.identity),
      batch
    ),
    'identity'
  )

  t.true(
    equalIterable(
      batch.map(f).map(g),
      batch.map(R.compose(f, g))
    ),
    'composition'
  )

  // fantasy-land
  t.true(
    equalIterable(
      R.map(f, batch),
      batch.map(f)
    )
  )
})

// Filterable
test('filter', t => {
  const batch = Batch(xs)

  const p = x => Bid.is(x)
  const q = x => x.lte(Bid(210, 1))

  t.true(
    equalIterable(
      batch.filter(R.both(p, q)),
      batch.filter(p).filter(q)
    ),
    'distributivity'
  )

  t.true(
    equalIterable(
      batch.filter(R.T),
      batch
    ),
    'identity'
  )

  t.true(
    equalIterable(
      batch.filter(R.F),
      Batch(xsNext).filter(R.F)
    ),
    'annihilation'
  )
})

// Foldable
test('reduce', t => {
  const batch = Batch(xs)

  const concater = (y, x) => y.concat(Batch([x]))

  // Laws

  t.true(
    equalIterable(
      batch.reduce(concater, Batch.empty()),
      batch
    ),
    'identity'
  )

  // Behavior

  t.is(
    batch.reduce((y, x) => y + x.quantity, 0),
    4,
    'value'
  )
})
