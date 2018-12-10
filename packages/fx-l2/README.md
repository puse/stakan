# Orderbook

## Schema

### Taxonomy

##### `scope` *(string)*

Is `l2`

##### `type` *(string)*

Type

### Identifier

##### `symbol` *(string)*

E.g. `xmr-usd`

##### `broker` *(string)*

E.g. `binance`

### Correlation

##### `cid` *(number)*

Millisecond timestamp of initial data snapshot

##### `rev` *(number)*

Sequential revision number, relative to `cid`

### Data

##### `attributes` *(object)*

Single entity data

##### `members` *(array)*

Collection of entities

## Types

### `order`

A single aggregate order

###### Attributes

##### `side` *(string)*

##### `price` *(number)*

##### `amount` *(number)*

###### Example

```json
{ "scope"  : "l2",
  "type"   : "order",
  "symbol" : "btc-usd",
  "cid"    : 1530060819000,
  "rev"    : 121,
  "attributes" : { "side": "asks",
                   "price": 3488.6,
                   "amount": 0.029 } }
```

### `orderbook` *(array)*

Snapshot of orderbook at given time

###### Members

- `order`

###### Example

```json
{ "scope"  : "l2",
  "type"   : "orderbook",
  "broker" : "cexio",
  "symbol" : "btc-usd",
  "cid"    : 1530060819000,
  "rev"    : 121,
  "members"   : [ { "side": "bids", "price": 3484.8, "amount": 0.025 },
                  { "side": "bids", "price": 3485.1, "amount": 0.011 },
                  { "side": "asks", "price": 3488.6, "amount": 0.029 },
                  { "side": "asks", "price": 3489.6, "amount": 0.12  },
                  { "side": "asks", "price": 3490.6, "amount": 0.305 } ] }
```
