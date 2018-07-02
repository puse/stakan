const {
  compose,
  toUpper,
  toLower,
  split,
  replace,
  zipObj
} = require('ramda')

const symbolToPair = compose(
  split('-'),
  toUpper
)

const symbolFrom = compose(
  toLower,
  replace(':', '-')
)

const rowFrom = zipObj(['price', 'amount'])

module.exports = {
  symbolToPair,
  symbolFrom,
  rowFrom
}
