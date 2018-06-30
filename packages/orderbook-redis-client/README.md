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

#### `OBADD key seed BIDS price amount ASKS price amount`

```
> OBADD cexio:xmr-usd 1530060819000 BIDS 119.5 22.1 120 88 ASKS 121 8.2 122 50

1) 1526985054069-1
2) 1526985054069-2
3) 1526985054069-3
4) 1526985054069-4
```

#### `OBIMPORT key [start] [end]`

```
> OBIMPORT cexio:xmr-usd 

1) "1530060819000-4"

> OBIMPORT cexio:xmr-usd 

1) nil
```

#### `OBDEPTH key`

```
> OBDEPTH cexio:xmr-usd

1) 1) "120"
   2) "88"
   3) "119.5"
   4) "22.1"
2) 1) "121"
   2) "8.2"
   3) "122"
   4) "50"
```

#### `OBTOP key`

```
> OBTOP cexio:xmr-usd

1) 1) "120"
   2) "88"
2) 1) "121"
   2) "8.2"
```
