const { readFileSync } = require('fs')

const Redis = require('ioredis')

const {
  assoc,
  fromPairs,
  compose,
  map,
  zipObj,
  splitEvery,
  flatten,
  props
} = require('ramda')

const setupScripts = require('./scripts')

/**
 *
 */

const { Command } = Redis

/**
 * Utils
 */


/**
 *
 */

class Client extends Redis {
  constructor () {
    super()

    setupScripts(this)
  }

  obcommit (...args) {
    return this.OBCOMMIT(...args)
  }

  obadd (key, seed, bids = [], asks = []) {
    const args = []

    const toArgs = props(['price', 'amount'])

    if (bids.length) {
      const members = bids.map(toArgs)
      args.push('BIDS', members)
    }

    if (asks.length) {
      const members = asks.map(toArgs)
      args.push('ASKS', members)
    }

    return this.OBADD(key, seed, ...flatten(args))
  }

  obdepth (key) {
    const toEntry = zipObj(['price', 'amount'])

    const parse = compose(
      map(toEntry),
      splitEvery(2),
      map(Number)
    )

    const recover = res => {
      const [ asks, bids, rev ] = res

      return {
        rev,
        asks: parse(asks),
        bids: parse(bids)
      }
    }

    return this
      .OBDEPTH(key)
      .then(recover)
  }

  obwatch (topic, id = '$', t = 1e3) {
    const key = `${topic}:ob:log`
    const args = ['BLOCK', t, 'streams', key, id]
    const options = {
      replyEncoding: 'utf8'
    }

    const cmd = new Command('xread', args, options)

    const parseArr = compose(
      fromPairs,
      splitEvery(2)
    )

    const parseRow = pair => {
      const [ id, arr ] = pair

      const entry =  parseArr(arr)

      return assoc('id', id, entry)
    }

    const recover = res => {
      if (!res) return res

      const arr = res[0][1]

      return map(parseRow, res[0][1])
    }

    return this
      .sendCommand(cmd)
      .then(recover)
  }
}

module.exports = Client
