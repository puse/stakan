const { Suite } = require('benchmark')

const { Observable } = require('rxjs/Rx')

const R = require('ramda')

const Daggy = require('daggy')

const O = require('../lib/operators')

const rawAssets = require('../assets/raw.json')

// Helpers

const resolve = deferred => res => {
  return deferred.resolve()
}

// Asserts
//
const convertNext = () => {
  const session = Date.now()

  return (triple, offset) => {
    const [ price, count, amount ] = triple
    const quantity = count === 0
      ? 0
      : amount

    return JSON.stringify({
      correlation: { session, offset },
      level: { price, quantity }
    })
  }
}

// Types

const Level = Daggy.tagged('Level', ['price', 'quantity'])

Level.fromBitfinex = (triple) => {
  const [ price, count, amount ] = triple
  const quantity = count === 0
    ? 0
    : amount

  return Level(price, quantity)
}

const Correlation = Daggy.tagged('Correlation', ['session', 'offset'])

const Packet = Daggy.tagged('Packet', ['correlation', 'level'])

Packet.prototype.toBuffer = function () {
  return JSON.stringify(this)
}

Packet.toBuffer = (packet) => {
  return packet.toBuffer()
}

const convertTypes = () => {
  const session = Date.now()

  return (triple, offset) => {
    const correlation = Correlation(session, offset)
    const level = Level.fromBitfinex(triple)
    return Packet(correlation, level).toBuffer()
  }
}

// Benchmarks

Suite('Pipeline')
  .add('raw', {
    defer: true,
    fn (deferred) {
      Observable
        .from(rawAssets)
        .map(JSON.stringify)
        .toArray()
        .toPromise()
        .then(resolve(deferred))
    }
  })
  .add('current', {
    defer: true,
    fn (deferred) {
      Observable
        .from(rawAssets)
        .pipe(
          O.recoverLevels(),
          O.stampCorrelation(),
          O.toBuffer()
        )
        .toArray()
        .toPromise()
        .then(resolve(deferred))
    }
  })
  .add('next', {
    defer: true,
    fn (deferred) {
      Observable
        .from(rawAssets)
        .map(convertNext())
        .toArray()
        .toPromise()
        .then(resolve(deferred))
    }
  })
  .add('nextTypes', {
    defer: true,
    fn (deferred) {
      Observable
        .from(rawAssets)
        .map(convertTypes())
        .toArray()
        .toPromise()
        .then(resolve(deferred))
    }
  })
  .on('complete', onComplete)
  .run({ 'async': true })

// Reporter

function onComplete () {
  const header = this.name
  const body = this.map(r => `  ${r}`).join('\n')

  console.log(R.join('\n', [header, body]))
}
