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
 * */

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

/**
 * Computed
 */

function topic () {
  const from = compose(
    join('/'),
    props(['broker', 'symbol'])
  )

  return from(this)
}

function orders () {
  const { snapshot$ } = this

  if (!snapshot$) return {}

  const from = applySpec({
    bids: fromSide('bids'),
    asks: fromSide('asks')
  })

  return from(snapshot$.rows)
}

/**
 * Expose
 */

export {
  topic,
  orders
}
