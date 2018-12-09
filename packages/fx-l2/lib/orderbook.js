const R = require('ramda')

const concat = require('./helpers/concat')

class Orderbook {
  constructor (...orders) {
    Object.assign(this, { orders })
  }

  // concat :: Orderbook a => a ~> a -> a

  concat (book) {
    const orders = concat(this.orders, book.orders)
    return Orderbook.from(orders)
  }

  filter (pred) {
    const orders = R.filter(pred, this.orders)
    return Orderbook.from(orders)
  }

  static empty () {
    return new Orderbook()
  }

  static of (order) {
    return new Orderbook(order)
  }

  static from (orders) {
    return new Orderbook(...orders)
  }
}

module.exports = Orderbook
