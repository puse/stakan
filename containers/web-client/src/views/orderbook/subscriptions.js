import {
  Subject,
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

const request = Axios.create({ baseURL: '/api' })

const client = mqtt.connect('ws://localhost:9001')

client.subscribe('orderbook/cexio/btc-usd')

const snapshot$ = new ReplaySubject()
const update$ = new ReplaySubject()
const source$ = new ReplaySubject()

Observable
  .fromEvent(client, 'message')
  .take(1)
  .flatMap(_ => request('orderbooks/cexio/btc-usd'))
  .map(prop('data'))
  .subscribe(snapshot$)

Observable
  .fromEvent(client, 'message', (_, m) => m)
  .map(JSON.parse)
  .subscribe(update$)

update$.subscribe(console.log)

//

const switchRelevant = pair => {
  const [ snapshot, update ] = pair

  return snapshot.id < update.id
    ? update
    : snapshot
}

const datasetFromDict = compose(
  map(map(Number)),
  filter(x => x[1] > 0),
  toPairs
)

const commitToAcc = (prev, next) => {
  const bids = merge(
    fromPairs(prev.bids),
    fromPairs(next.bids)
  )

  const asks = merge(
    fromPairs(prev.asks),
    fromPairs(next.asks)
  )

  return {
    id: next.id,
    ts: next.ts,
    bids: datasetFromDict(bids),
    asks: datasetFromDict(asks)
  }
}

function subscriptions () {
  const stream$ = Observable
    .combineLatest(snapshot$, update$)
    .map(switchRelevant)
    .scan(commitToAcc)

  return {
    stream: stream$
  }
}

export default subscriptions
