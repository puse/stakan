/* eslint-disable */
const daggy = require('daggy')
// const R = require('ramda')

const levelSpec = {
  Bid: ['price', 'quantity'],
  Ask: ['price', 'quantity'],
  Nil: ['price']
}

const Level = daggy.taggedSum('Level', levelSpec)

Level.prototype.equals = function (that) {
  return this.price === that.price
}

/**
 * lte :: Ord a => a ~> a -> Boolean
 */

Level.prototype.lte = function (that) {
  return this.price <= that.price
}

/**
 * gt :: Ord a => a ~> a -> Boolean
 */

Level.prototype.gt = function (that) {
  return !this.lte(that)
}


module.exports = Level
