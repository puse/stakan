/**
 * Helpers
 */

const topicOf = ({ scope, broker, symbol }) =>
  `${scope}/${broker}/${symbol}`

const serialize = payload =>
  JSON.stringify(payload)

/**
 * Expose
 */

module.exports = {
  topicOf,
  serialize
}
