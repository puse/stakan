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

#### `OBLOG key seed BIDS price amount ASKS price amount`

```
> OBLOG cexio:xmr-usd 1530060819000 BIDS 120 88 ASKS 121 8.2

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
#### `OBIMPORT key [start] [end]`

```
> OBIMPORT cexio:xmr-usd 

1) "1530060819000-2"

> OBIMPORT cexio:xmr-usd 

1) nil
```

### `OBDEPTH key`

```
> OBDEPTH cexio:xmr-usd

1) 1) "120"
   2) "88"
2) 1) "121"
   2) "8.2"
```
