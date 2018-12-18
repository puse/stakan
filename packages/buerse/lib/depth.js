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

  /**
   * equals :: Side a => a ~> a -> Boolean
   */

  equals (that) {
    const bidsEqual = this.bids.equals(that.bids)
    const asksEqual = this.asks.equals(that.asks)

    return bidsEqual && asksEqual
  }

  /**
   * concat :: Side a => a ~> a -> a
   */

  concat (that) {
    const bids = this.bids.concat(that.bids)
    const asks = this.asks.concat(that.asks)

    return new Depth(bids, asks)
  }

  /**
   * bimap :: Depth f => f a c ~> (a -> b, c -> d) -> f b d
   */

  bimap (bidsFn, asksFn) {
    const bids = this.bids.map(bidsFn)
    const asks = this.asks.map(asksFn)

    return new Depth(bids, asks)
  }


  /**
   * empty :: Depth m => () -> m
   */

  static empty () {
    return new Depth([], [])
  }
}

module.exports = Depth
