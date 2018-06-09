import {
  prop,
  reverse,
  compose,
  sortBy,
  nth
} from 'ramda'

const sortedByPrice = sortBy(nth(0))

function bidsData () {
  const op = compose(
    reverse,
    sortedByPrice,
    prop('bids')
  )

  return op(this)
}

function asksData () {
  const op = compose(
    sortedByPrice,
    prop('asks')
  )

  return op(this)
}

export {
  bidsData,
  asksData
}
