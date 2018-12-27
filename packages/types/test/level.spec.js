import test from 'ava'

import Level from '../lib/level'

// Tests

test('constructor', t => {
  // Behavior
  t.true(Level.is(Level(40, 2)), 'type')

  // Sanity
  t.throws(() => Level(40), TypeError, 'arguments')

  // Behavior
  const level = Level(40, 2)

  t.is(level.price, 40, 'value')
  t.is(level.quantity, 2, 'value')
})
