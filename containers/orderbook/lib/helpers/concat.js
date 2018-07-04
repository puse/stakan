const {
  compose,
  curry,
  merge,
  fromPairs,
  toPairs
} = require('ramda')

const fromDict = require('./from-dict')

function concat (a, b) {
  const dict = merge(
    fromPairs(a),
    fromPairs(b)
  )

  return fromDict(dict)
}

module.exports = curry(concat)
