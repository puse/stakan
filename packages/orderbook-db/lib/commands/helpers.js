const {
  curryN,
  join
} = require('ramda')

function targetFrom (params) {
  if (typeof params === 'string') {
    const [ broker, symbol ] = params.split('/')
    return { broker, symbol }
  }

  return params
}

function targetToUri (params) {
  if (typeof params === 'string') return params

  const { broker, symbol } = params

  return `${broker}/${symbol}`
}

function keyFor (root, sub) {
  const target = targetToUri(root)
  return join(':', [ target, 'ob', sub ])
}

module.exports.targetFrom = targetFrom
module.exports.targetToUri = targetToUri
module.exports.keyFor = curryN(2, keyFor)
