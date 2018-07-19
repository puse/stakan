const {
  keyFor,
  targetFrom,
  targetToString
} = require('./helpers')

function l2commit (redis, target, ...range) {
  const key = targetToString(target)

  return redis.l2commit(key, ...range)
}

module.exports = l2commit
