import {
  applySpec,
  compose,
  prop,
  props,
  reverse,
  filter,
  whereEq,
  sortBy,
  join
} from 'ramda'

/**
 *
 */

const EMPTY = {
  bids: [],
  asks: []
}

/**
 * Helpers
 */

const fromSide = side => {
  const byPriceUp = sortBy(prop('price'))

  const sorted = side === 'bids'
    ? compose(reverse, byPriceUp)
    : byPriceUp

  const relevant = filter(whereEq({ side }))

  return compose(sorted, relevant)
}

const ordersFrom = applySpec({
  bids: fromSide('bids'),
  asks: fromSide('asks')
})

/**
 * Computed
 */

function topic () {
  const op = compose(
    join('/'),
    props(['broker', 'symbol'])
  )

  return op(this)
}

function orders () {
  const { snapshot$ } = this

  if (!snapshot$) return EMPTY

  return ordersFrom(snapshot$.rows)
}

/**
 * Expose
 */

export {
  topic,
  orders
}
