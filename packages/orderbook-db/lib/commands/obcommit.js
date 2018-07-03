const {
  keyFor,
  targetFrom,
  targetToString
} = require('./helpers')

function obcommit (redis, target, ...range) {
  const key = targetToString(target)

  return redis.obcommit(key, ...range)
}

module.exports = obcommit
