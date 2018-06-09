import {
  Observable,
  ReplaySubject
} from 'rxjs/Rx'

import Axios from 'axios'

import mqtt from 'mqtt'

import {
  compose,
  map,
  prop,
  merge,
  fromPairs,
  toPairs,
  filter,
  sortBy
} from 'ramda'

const request = Axios.create({
  baseURL: '/api'
})

const client = mqtt.connect('ws://localhost:9001')

client.subscribe('orderbook/cexio/btc-usd')

const snapshotP = new Promise(r => client.on('connect', r))
  .then(_ => request('orderbooks/cexio/btc-usd'))
  .then(x => x.data)

const update$ = new ReplaySubject()

Observable
  .fromEvent(client, 'message', (_, m) => m)
  .map(JSON.parse)
  .subscribe(update$)

async function streamMembersP (key) {
  const snapshot = await snapshotP

  const isPrev = x =>
    Number(snapshot.id) === Number(x.id)

  const next$ = update$
    .skipWhile(isPrev)

  const asDict = compose(
    fromPairs,
    prop(key)
  )

  const recover = compose(
    map(map(Number)),
    filter(x => x[1] > 0),
    toPairs
  )

  return Observable
    .of(snapshot)
    .merge(next$)
    .map(asDict)
    .scan(merge)
    .map(recover)
}

function streamMembers (key) {
  return Observable
    .fromPromise(streamMembersP(key))
    .flatMap(x => x)
}

function subscriptions () {
  return {
    bids: streamMembers('bids'),
    asks: streamMembers('asks')
  }
}

export default subscriptions
