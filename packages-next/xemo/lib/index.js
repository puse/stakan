const R = require('ramda')

const { Observable } = require('rxjs/Rx')

const keyFromTopic = topic => {
  const { broker, symbol } = topic
  return `${broker}/${symbol}`
}

const recordFromRes = res => {
  const [id, pairs] = res
  const [session, offset] = id.split('-').map(Number)
  const [ a, price, b, quantity ] = pairs.map(Number)

  const header = { session, offset }
  const level = { price, quantity }

  return { header, level }
}

function xemo (db, topic) {
  const key = keyFromTopic(topic)

  const listen = (observer) => {
    const emit = x => {
      observer.next(recordFromRes(x))
      return x[0]
    }

    const emitAll = (res) => {
      const [, xs] = res

      if (!Array.isArray(xs)) return void 0

      return R.last(R.map(emit, xs))
    }

    const xread = (rev = 0) => {
      const next = R.compose(xread, R.defaultTo(rev))

      db.xread('BLOCK', 1000, 'STREAMS', key, 0)
        .then(R.unnest)
        .then(emitAll)
        .then(rev)
    }

    xread()
  }

  return Observable.create(listen)
}

module.exports = xemo
