const { createHmac } = require('crypto')

/**
 * Create SHA256 HMAC
 *
 * @param {string} key
 * @param {string} message
 *
 * @returns {string} - hex digest
 */

const hmacFrom = (key, msg) => {
  const hmac = createHmac('sha256', key)
  hmac.update(msg)

  return hmac.digest('hex')
}

/**
 * Expose
 */

module.exports = {
  hmacFrom
}
