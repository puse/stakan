const getenv = require('getenv')

// URL

const url = getenv('BITFINEX_URL', 'wss://api.bitfinex.com/ws/2')

// Creds

getenv.disableErrors()

const apiKey = getenv('BITFINEX_API_KEY', '')
const apiSecret = getenv('BITFINEX_API_SECRET', '')

getenv.enableErrors()

// Expose config

module.exports = {
  url,
  apiKey,
  apiSecret,
  ws: {
    autoReconnect: false,
    seqAudit: true
  }
}
