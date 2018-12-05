# Stakan

Realtime orderbook data streams.

- Expose MQTT channels
  - `orderbook/{market}/{symbol}`.
  - `ticker/{market}/{symbol}`.

Markets

- `cexio`

Symbols

- `btc-usd`
- `btc-eur`
- `dash-usd`
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

- Mosquitto as MQTT broker
- Redis as data store with custom Lua scripting
- Node.js for data processing
  - Utilizes RxJS for internal stream representation
- Kafka for streams with Lenses UI
- Elasticsearch as analytical database 

Front-end is made using Vue.js/Vuex
