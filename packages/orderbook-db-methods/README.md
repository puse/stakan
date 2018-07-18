# Orderbook scripts


## Schema

#### Identifier

- `seed`
- `offset`

#### Key

- `symbol` - E.g. `xmr-usd`
- `broker` - E.g. `cexio`

#### Body

- `price` - Negative means bids
- `amount` - Can be 0

## API

### Instance methods

#### `l2add`

**Arguments**

- `topic` - String. Identifier in format of `BROKER:SYMBOL`
- `seed` - Number
- `bids` - Array of entries
- `asks` - Array of entries

**Reply**

Array of inserted entries ids

```js
const seed = Date.now()

const bids = [ { price: 24.8, amount: 1.8 } ]
const asks = [ { price: 25.2, amount: 2 } ]

client
  .l2add('hopar:exo-nyx', seed, bids, asks)
  .then(console.log)

// ['1530060819000-1', '1530060819000-2']
```

#### `l2commit`

- `topic`
- `start` - By default last cached ref or `0-0`
- `end` - Last id to fetch

#### `l2depth`

- `topic`

#### `l2watch`

**Arguments**

- `topic`
- `rev` - Last fetched id, `$` by default (ongoing)
- `t` - Milliseconds to block, `1000` by default
