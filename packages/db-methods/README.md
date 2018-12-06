# Orderbook DB methods

## Schema

#### Identifier

- `seed`
- `offset`

#### Key

- `symbol` - E.g. `xmr-usd`
- `broker` - E.g. `cexio`

#### Row Entry

- `side` - Bids or asks
- `price` - Negative means bids
- `amount` - Can be 0

## API

### Instance methods

Level 2 aggregation methods

#### `l2add`

**Arguments**

- `topic` - 
- `session` - Number
- `rows` - Array of entries

**Reply**

Array of inserted entries ids

```js
const session = Date.now()

const topic = {
  broker: 'cexio',
  symbol: 'btc-usd',
}

const rows = [ 
  { side: 'bids', price: 4524.8, amount: 1.8 } 
  { side: 'asks', price: 4528.2, amount: 2 }
]

client
  .l2add(topic, session, rows)
  .then(console.log) // > '1530060819000-2'
```

#### `l2commit`

**Arguments**

- `topic`
- `start` - By default last cached ref or `0-0`
- `end` - Last id to fetch

```js
const topic = {
  broker: 'cexio',
  symbol: 'btc-usd',
}

client
  .l2commit(topic)
  .then(console.log) // > '1530060819000-2'
```

#### `l2depth`

**Arguments**

- `topic`

```js
const topic = {
  broker: 'cexio',
  symbol: 'btc-usd',
}

client
  .l2depth(topic)
  .then(console.log) 

// { broker: 'cexio',
//   symbol: 'btc-usd',
//   rev: '1530060819000-2',
//   rows: [
//     { side: 'bids', price: 4524.8, amount: 1.8 } 
//     { side: 'asks', price: 4528.2, amount: 2 }
//   ]
// }
```

#### `l2watch`

**Arguments**

- `topic`
- `rev` - Last fetched id, `$` by default (ongoing)
- `timeout` - Milliseconds to block, `1000` by default

```js
const topic = {
  broker: 'cexio',
  symbol: 'btc-usd',
}

client
  .l2watch(topic, '1530060819000')
  .then(console.log)

// [ { broker: 'hopar',
//     symbol: 'exo-nyx',
//     side: 'bids',
//     price: '24.5',
//     amount: '1',
//     id: '1-1' },
//   { broker: 'hopar',
//     symbol: 'exo-nyx',
//     side: 'asks',
//     price: '25',
//     amount: '1',
//     id: '1-2' } ]
```
