# lymo

`LevelRecord` producer, sourcing remote broker

## Usage

#### Install

```sh
npm install @stakan/lymo
```

#### Example

```js
const Source = require('@stakan/lika')

const config = void 0

const topic = {
  broker: 'bitfinex',
  symbol: 'btc-usd'
}

Source(config, topic)
  .subscribe(console.log)
```
