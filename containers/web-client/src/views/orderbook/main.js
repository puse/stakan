import OrderbookTable from '@/components/orderbook-table'

import {
  toPairs
} from 'ramda'

import subscriptions from './subscriptions'

function data () {
  return {
    bids: {},
    asks: {}
  }
}

const computed = {
  bidsData () {
    return toPairs(this.bids)
  },
  asksData () {
    return toPairs(this.asks)
  }
}

export default {
  name: 'orderbook',
  data,
  computed,
  subscriptions,
  components: {
    OrderbookTable
  }
}
