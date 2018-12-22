import test from 'ava'

import { Bid, Ask, Nil } from '../lib/level'

// Helpers

const equals = (a, b) => String(a) === String(b)

// Tests

test('constructor', t => {
  // Behavior
  t.true(Bid.is(Bid(40, 2)), 'type')
  t.true(Ask.is(Ask(40, 2)), 'type')
  t.true(Nil.is(Nil(40)), 'type')

  // Sanity
  t.throws(() => Bid(40), TypeError, 'arguments')
  t.throws(() => Ask(40), TypeError, 'arguments')
  t.throws(() => Nil(40, 2), TypeError, 'arguments')
})

// fl specs

// Setoid
test('equals', t => {
  const a = Bid(40, 2)
  const b = Bid(40, 2)
  const c = Bid(40, 2)

  const o = Nil(42)

  const x = Ask(40, 2)

  // Laws

  t.true(a.equals(a), 'reflexivity')
  t.is(a.equals(b), b.equals(a), 'symmetry')
  t.is(a.equals(b) && b.equals(c), a.equals(c), 'transitivity')

  // Sanity

  t.throws(() => a.equals(x), TypeError, 'Bid === Ask')
  t.throws(() => x.equals(a), TypeError, 'Ask === Bid')

  t.throws(() => a.equals(o), TypeError, 'Bid === Nil')
  t.throws(() => o.equals(a), TypeError, 'Nil === Bid')

  // Behavior

  t.true(
    Bid(40, 2).equals(Bid(40, 2)),
    'Bid(40, 2) == Bid(40, 2)'
  )

  t.true(
    Bid(40, 2).equals(Bid(40, 3)),
    'Bid(40, 2) == Bid(40, 3)'
  )

  t.false(
    Bid(40, 2).equals(Bid(42, 2)),
    'Bid(40, 2) != Bid(42, 2)'
  )
})

// Ord
test('lte, lt, gte, gt', t => {
  const a = Bid(40, 2)
  const b = Bid(42, 2)
  const c = Bid(42, 2)

  const o = Nil(42)

  const x = Ask(40, 2)
  const y = Ask(42, 2)

  // Laws

  t.true(a.lte(b) || b.lte(a), 'totality')
  t.is(a.lte(b) && b.lte(a), a.equals(b), 'antisymmetry')
  t.is(b.lte(c) && c.lte(b), b.equals(c), 'antisymmetry')
  t.is(a.lte(b) && b.lte(c), a.lte(c), 'transitivity')

  // Sanity

  t.throws(() => a.lte(x), TypeError, 'Bid <= Ask')
  t.throws(() => x.lte(a), TypeError, 'Ask <= Bid')

  t.throws(() => a.lte(o), TypeError, 'compare w/ Nil')
  t.throws(() => o.lte(a), TypeError, 'compare w/ Nil')
  t.throws(() => o.lte(o), TypeError, 'compare w/ Nil')

  // Behavior

  t.true(a.lte(a), 'Bid(40, 2) <= Bid(40, 2)')
  t.false(a.lte(b), 'Bid(40, 2) <= Bid(42, 2)')
  t.true(b.lte(a), 'Bid(42, 2) <= Bid(40, 2)')

  t.true(x.lte(x), 'Ask(40, 2) <= Ask(40, 2)')
  t.true(x.lte(y), 'Ask(40, 2) <= Ask(42, 2)')
  t.false(y.lte(x), 'Ask(42, 2) <= Ask(40, 2)')

  // Extended behavior

  t.false(x.lt(x), 'Ask(40, 2) < Ask(40, 2)')
  t.true(x.lt(y), 'Ask(40, 2) < Ask(42, 2)')
  t.false(y.lt(x), 'Ask(42, 2) < Ask(40, 2)')

  t.true(x.gte(x), 'Ask(40, 2) => Ask(40, 2)')
  t.false(x.gte(y), 'Ask(40, 2) => Ask(42, 2)')
  t.true(y.gte(x), 'Ask(42, 2) => Ask(40, 2)')

  t.false(x.gt(x), 'Ask(40, 2) > Ask(40, 2)')
  t.false(x.gt(y), 'Ask(40, 2) > Ask(42, 2)')
  t.true(y.gt(x), 'Ask(42, 2) > Ask(40, 2)')
})
