const { Bids, Asks } = require('./depth.side')

class Depth {
  constructor (bids, asks) {
    this.bids = Bids.from(bids)
    this.asks = Asks.from(asks)
  }

  valueOf () {
    const bids = this.bids.valueOf()
    const asks = this.asks.valueOf()

    return { bids, asks }
  }

  concat (that) {
    const bids = this.bids.concat(that.bids)
    const asks = this.asks.concat(that.asks)

    return new Depth(bids, asks)
  }
}

module.exports = Depth
