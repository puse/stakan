import OrderbookTable from '@/components/orderbook-table'

const SNAPSHOT = {
  "ts": Date.now(),
  "broker": "cexio",
  "symbol": "exo-usd",
  "bids": [
    [ 95, 1 ],
    [ 90, 1 ],
    [ 85, 1 ]
  ],
  "asks": [
    [ 105, 1 ],
    [ 110, 1 ],
    [ 115, 1 ]
  ]
}

export default {
  name: 'orderbook',
  data: _ => SNAPSHOT,
  components: {
    OrderbookTable
  }
}
