# remote-connector

## API

#### Example

```js
const Source = require('@stakan/source-remote')

const config = void 0

const topic = {
  broker: 'bitfinex',
  symbol: 'btc-usd'
}

Source(config, topic)
  .subscribe(console.log)
```
