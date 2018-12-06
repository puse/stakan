const {
  targetToString
} = require('./helpers')

/**
 * Commit journal entries to data lists
 *
 * @async
 *
 * @param {Redis} db
 * @param {Topic} topic
 * @param {Number} [start]
 * @param {Array} [end]
 *
 * @return {Promise} - last inserted rev id
 */

function l2commit (redis, topic, ...range) {
  const key = targetToString(topic)
  return redis.l2commit(key, ...range)
}

module.exports = l2commit
