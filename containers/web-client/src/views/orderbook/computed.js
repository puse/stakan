import {
  applySpec,
  compose,
  prop,
  props,
  reverse,
  take,
  filter,
  whereEq,
  sortBy,
  join
} from 'ramda'

/**
 *
 */

const LIMIT = 8

/**
 * Helpers
 */

const fromSide = side => {
  const limited = take(LIMIT)

  const byPriceUp = sortBy(prop('price'))

  const sorted = side === 'bids'
    ? compose(reverse, byPriceUp)
    : byPriceUp

  const relevant = filter(whereEq({ side }))

  return compose(limited, sorted, relevant)
}

const ordersFrom = applySpec({
  bids: fromSide('bids'),
  asks: fromSide('asks')
})

const topicFrom = compose(
  join('/'),
  props(['broker', 'symbol'])
)

/**
 * Computed
 */

function topic () {
  return topicFrom(this)
}

function orders () {
  const { snapshot$ } = this

  if (!snapshot$) return {}

  return ordersFrom(snapshot$.rows)
}

/**
 * Expose
 */

export {
  topic,
  orders
}
