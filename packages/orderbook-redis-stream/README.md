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

#### `OBLOG key seed price amount [price amount]`

```
> OBLOG cexio:xmr-usd 1530060819000 -120 88 121 8.2

1) 1526985054069-1
2) 1526985054069-2

> XRANGE cexio:xmr-usd 1530060819000 +

1) 1) 1526985054069-1
   2) 1) "side"
      2) "bid"
      3) "price"
      4) "120"
      5) "amount"
      6) "88"
2) 1) 1526985054069-2
   2) 1) "side"
      2) "ask"
      3) "price"
      4) "121"
      5) "amount"
      6) "8.2"
```
#### `OBFEED [COUNT count] [BLOCK milliseconds] key`

```
> OBFEED COUNT 100 BLOCK 2000 cexio:xmr-usd

1) "1530060819000-2"
```

### `OBDEPTH key [DEPTH depth] [WITHAMOUNTS]`

```
> OBDEPTH cexio:xmr-usd DEPTH 1 WITHAMOUNTS

1) 1) "120"
   2) "88"
2) 1) "121"
   2) "8.2"

```
