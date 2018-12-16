import test from 'ava'

import * as R from 'ramda'
import Bids from '../lib/bids'

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

test('constructor', t => {
  const bids = new Bids(xs)

  t.true(bids instanceof Bids, 'type')

  t.deepEqual(
    bids.toArray(),
    bids.valueOf(),
    'api'
  )

  t.deepEqual(
    bids.valueOf(),
    [ [ 70, 1 ],
      [ 60, 1 ],
      [ 50, 1 ] ],
    'sorted value'
  )
})

test('iterator', t => {
  const bids = new Bids(xs)

  const [ best ] = bids

  t.deepEqual(best, [ 70, 1 ])
})

//
test('of', t => {
  const x = [50, 1]
  const bids = Bids.of(x)

  t.true(bids instanceof Bids, 'type')

  t.true(
    R.equals(
      bids,
      new Bids([ x ])
    ),
    'value'
  )
})

test('from', t => {
  const bids = Bids.from(xs)

  t.true(bids instanceof Bids, 'type')

  t.true(
    R.equals(
      bids,
      new Bids(xs)
    ),
    'value'
  )
})


// fl specs

// Setoid
test('equals', t => {
  const a = Bids.from(xs)
  const b = Bids.from(xs)
  const c = Bids.from(xs)

  t.true(a.equals(a), 'reflexivity')
  t.is(a.equals(b), b.equals(a), 'symmetry')
  t.is(a.equals(b) && b.equals(c), a.equals(c), 'transitivity')
})

// Semigroup
test('concat', t => {
  const bids = Bids.from(xs)
  const bidsNext = Bids.from(xsNext)
  const bidsExt = Bids.of([ 80, 4 ])

  t.true(bids.concat(bidsNext) instanceof Bids, 'type')

  t.true(
    R.equals(
      bids.concat(bidsNext),
      Bids.from([ [75, 3],
                  [70, 2],
                  [60, 1],
                  [50, 0] ])
    ),
    'value'
  )

  t.true(
    R.equals(
      bids.concat(bidsNext).concat(bidsExt),
      bids.concat(bidsNext.concat(bidsExt))
    ),
    'associativity'
  )
})

// Monoid
test('empty', t => {
  const bids = Bids.from(xs)
  const empty = Bids.empty()

  t.true(empty instanceof Bids, 'type')

  t.true(R.equals(empty, Bids.from([])), 'value')

  t.true(
    R.equals(
      bids.concat(empty),
      bids
    ),
    'right identity'
  )

  t.true(
    R.equals(
      empty.concat(bids),
      bids
    ),
    'left identity'
  )
})

// Functor
test('map', t => {
  const bids = Bids.from(xs)

  const f = ([p, q]) => [p+1, q]
  const g = ([p, q]) => [p, q*2]

  t.true(
    R.equals(
      bids.map(R.identity),
      bids
    ),
    'identity'
  )

  t.true(
    R.equals(
      bids.map(f).map(g),
      bids.map(R.compose(f, g))
    ),
    'composition'
  )
})

// Filterable
test('filter', t => {
  const bids = Bids.from(xs)

  const p = R.propSatisfies(R.lt(50), 0)
  const q = R.propSatisfies(R.gt(70), 0)

  t.true(bids.filter(p) instanceof Bids, 'type')

  t.true(
    R.equals(
      bids.filter(R.both(p, q)),
      bids.filter(p).filter(q)
    ),
    'distributivity'
  )

  t.true(
    R.equals(
      bids.filter(R.T),
      bids
    ),
    'identity'
  )

  t.true(
    R.equals(
      bids.filter(R.F),
      Bids.from(xsNext).filter(R.F)
    ),
    'annihilation'
  )

  //

  t.true(
    R.equals(
      bids.filter(p),
      Bids.from([ [60, 1],
                  [70, 1] ])
    ),
    'value'
  )

})

// Foldable
test('reduce', t => {
  const bids = Bids.from(xs)

  const concater = (y, x) => y.concat(Bids.of(x))

  t.true(
    R.equals(
      bids.reduce(concater, Bids.empty()),
      bids
    ),
    'identity'
  )

  //

  t.is(
    bids.reduce((y, x) => y + x[1], 0),
    3,
    'value'
  )
})
