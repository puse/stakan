# Stakan

Realtime orderbook data streams.

- Expose MQTT channels
  - `{market}/{symbol}`.

Markets

- `cexio`
- `bitfinex`

Symbols

- `btc-usd`
- `eth-usd`

## Usage

```sh
docker-compose up
```

### Development

```sh
docker-compose up

```

## Tech. Stack

- [x] Mosquitto as MQTT broker
- [x] Redis as data store with custom Lua scripting
- [x] Node.js for data processing
  - [x] Utilizes RxJS for internal stream representation
- [ ] Kafka for streams with Lenses UI
- [ ] Elasticsearch as analytical database 

Front-end is made using Vue.js/Vuex
