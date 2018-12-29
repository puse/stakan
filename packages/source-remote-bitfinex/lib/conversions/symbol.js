const R = require('ramda')

const convert = R.compose(
  R.concat('t'),
  R.join(''),
  R.map(R.toUpper),
  R.split('-')
)

module.exports = {
  convert
}
