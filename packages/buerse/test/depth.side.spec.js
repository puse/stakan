import test from 'ava'

import * as R from 'ramda'
import Side, { Bids, Asks } from '../lib/depth.side'

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
  const side = new Side(xs)

  t.true(side instanceof Side, 'type')

  t.is(new Side(side), side, 'self')

  t.deepEqual(
    side.toArray(),
    side.valueOf(),
    'api'
  )

  t.deepEqual(
    new Side().valueOf(),
    new Side([]).valueOf(),
    'default arguments'
  )

  t.deepEqual(
    side.valueOf(),
    [ [ 50, 1 ],
      [ 70, 1 ],
      [ 60, 1 ] ],
    'sorted value'
  )
})

test('iterator', t => {
  const side = new Side(xs)

  t.deepEqual([...side], xs)
})

//

test('of', t => {
  const x = [50, 1]
  const side = Side.of(x)

  t.true(side instanceof Side, 'type')

  t.true(
    R.equals(
      side,
      new Side([ x ])
    ),
    'value'
  )
})

test('from', t => {
  const side = Side.from(xs)

  t.true(side instanceof Side, 'type')

  t.true(
    R.equals(
      side,
      new Side(xs)
    ),
    'value'
  )
})

// fl specs

// Setoid
test('equals', t => {
  const a = Side.from(xs)
  const b = Side.from(xs)
  const c = Side.from(xs)

  t.true(a.equals(a), 'reflexivity')
  t.is(a.equals(b), b.equals(a), 'symmetry')
  t.is(a.equals(b) && b.equals(c), a.equals(c), 'transitivity')
})

// Semigroup
test('concat', t => {
  const side = Side.from(xs)
  const bidsNext = Side.from(xsNext)
  const bidsExt = Side.of([ 80, 4 ])

  t.true(side.concat(bidsNext) instanceof Side, 'type')

  t.true(
    R.equals(
      side.concat(bidsNext),
      Side.from(
        [ [50, 0],
          [70, 2],
          [60, 1],
          [75, 3] ]
      )
    ),
    'value'
  )

  t.true(
    R.equals(
      side.concat(bidsNext).concat(bidsExt),
      side.concat(bidsNext.concat(bidsExt))
    ),
    'associativity'
  )
})

// Monoid
test('empty', t => {
  const side = Side.from(xs)
  const empty = Side.empty()

  t.true(empty instanceof Side, 'type')

  t.true(R.equals(empty, Side.from([])), 'value')

  t.true(
    R.equals(
      side.concat(empty),
      side
    ),
    'right identity'
  )

  t.true(
    R.equals(
      empty.concat(side),
      side
    ),
    'left identity'
  )
})

// Functor
test('map', t => {
  const side = Side.from(xs)

  const f = ([p, q]) => [p + 1, q]
  const g = ([p, q]) => [p, q * 2]

  t.true(
    R.equals(
      side.map(R.identity),
      side
    ),
    'identity'
  )

  t.true(
    R.equals(
      side.map(f).map(g),
      side.map(R.compose(f, g))
    ),
    'composition'
  )
})

// Filterable
test('filter', t => {
  const side = Side.from(xs)

  const p = R.propSatisfies(R.lt(50), 0)
  const q = R.propSatisfies(R.gt(70), 0)

  t.true(side.filter(p) instanceof Side, 'type')

  t.true(
    R.equals(
      side.filter(R.both(p, q)),
      side.filter(p).filter(q)
    ),
    'distributivity'
  )

  t.true(
    R.equals(
      side.filter(R.T),
      side
    ),
    'identity'
  )

  t.true(
    R.equals(
      side.filter(R.F),
      Side.from(xsNext).filter(R.F)
    ),
    'annihilation'
  )

  //

  t.true(
    R.equals(
      side.filter(p),
      Side.from(
        [ [70, 1],
          [60, 1] ]
      )
    ),
    'value'
  )
})

// Foldable
test('reduce', t => {
  const side = Side.from(xs)

  const concater = (y, x) => y.concat(Side.of(x))

  t.true(
    R.equals(
      side.reduce(concater, Side.empty()),
      side
    ),
    'identity'
  )

  //

  t.is(
    side.reduce((y, x) => y + x[1], 0),
    3,
    'value'
  )
})

test('Asks', t => {
  const asks = new Asks(xs)

  t.true(asks instanceof Asks, 'type')
  t.true(asks instanceof Side, 'type')

  t.true(Asks.from(xs) instanceof Asks, 'type')
  t.true(Asks.of(xs[0]) instanceof Asks, 'type')
  t.true(Asks.empty() instanceof Asks, 'type')

  t.is(Asks.from(asks), asks, 'self')

  t.deepEqual(
    asks.valueOf(),
    [ [ 50, 1 ],
      [ 60, 1 ],
      [ 70, 1 ] ],
    'sorted ascending'
  )
})

test('Bids', t => {
  const bids = new Bids(xs)

  t.true(bids instanceof Bids, 'type')
  t.true(bids instanceof Side, 'type')

  t.true(Bids.from(xs) instanceof Bids, 'type')
  t.true(Bids.of(xs[0]) instanceof Bids, 'type')
  t.true(Bids.empty() instanceof Bids, 'type')

  t.is(Bids.from(bids), bids, 'self')

  t.deepEqual(
    bids.valueOf(),
    [ [ 70, 1 ],
      [ 60, 1 ],
      [ 50, 1 ] ],
    'sorted descending'
  )
})
