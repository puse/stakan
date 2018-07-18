# Redis

## API

#### `L2ADD key seed BIDS price amount ASKS price amount`

```
> L2ADD cexio:xmr-usd 1530060819000 BIDS 119.5 22.1 120 88 ASKS 121 8.2 122 50

1) 1530060819000-1
2) 1530060819000-2
3) 1530060819000-3
4) 1530060819000-4
```

#### `L2COMMIT key [start] [end]`

```
> L2COMMIT cexio:xmr-usd 

1) "1530060819000-4"

> L2COMMIT cexio:xmr-usd 

1) nil
```

#### `L2DEPTH key`

```
> L2DEPTH cexio:xmr-usd

1) 1) "120"
   2) "88"
   3) "119.5"
   4) "22.1"
2) 1) "121"
   2) "8.2"
   3) "122"
   4) "50"
```

#### `L2TOP key`

```
> L2TOP cexio:xmr-usd

1) 1) "120"
   2) "88"
2) 1) "121"
   2) "8.2"
```

