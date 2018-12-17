const Bids = require('./depth.bids')
const Asks = require('./depth.asks')

function Depth (bs, as) {
  this.bids = Bids.from(bs)
  this.asks = Asks.from(as)
}

module.exports = Depth
