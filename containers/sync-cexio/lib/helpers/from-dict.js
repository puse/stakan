const {
  compose,
  map,
  toPairs
} = require('ramda')

function fromDict (dict) {
  const allNumeric = map(Number)

  const op = compose(
    map(allNumeric),
    toPairs
  )

  return op(dict)
}

module.exports = fromDict
