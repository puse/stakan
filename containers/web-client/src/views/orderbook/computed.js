import {
  prop,
  reverse,
  compose,
  sortBy,
  head
} from 'ramda'

const sortedByPrice = sortBy(head)

function bidsData () {
  const op = compose(
    reverse,
    sortedByPrice,
    prop('bids')
  )

  return op(this.stream)
}

function asksData () {
  const op = compose(
    sortedByPrice,
    prop('asks')
  )

  return op(this.stream)
}

export {
  bidsData,
  asksData
}
