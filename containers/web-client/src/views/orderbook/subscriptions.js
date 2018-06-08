import {
  Observable,
  ReplaySubject
} from 'rxjs/Rx'

import Axios from 'axios'

import mqtt from 'mqtt'

import {
  prop,
  merge,
  fromPairs,
  toPairs,
  filter
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

  return Observable
    .of(snapshot)
    .merge(next$)
    .map(prop(key))
    .map(fromPairs)
    .scan(merge)
    .map(toPairs)
    .map(filter(x => x[1] > 0))
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
