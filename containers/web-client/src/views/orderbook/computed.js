import {
  compose,
  prop,
  propEq,
  props,
  reverse,
  filter,
  sortBy,
  join
} from 'ramda'

const sortedByPrice = sortBy(prop('price'))

function topic () {
  const op = compose(
    join('/'),
    props(['broker', 'symbol'])
  )

  return op(this)
}

function bids () {
  const { snapshot$ } = this

  if (!snapshot$) return []

  const op = compose(
    reverse,
    sortedByPrice,
    filter(propEq('side', 'bids'))
  )

  return op(snapshot$.rows)
}

function asks () {
  const { snapshot$ } = this

  if (!snapshot$) return []

  const op = compose(
    sortedByPrice,
    filter(propEq('side', 'asks'))
  )

  return op(snapshot$.rows)
}

export {
  topic,
  bids,
  asks
}
