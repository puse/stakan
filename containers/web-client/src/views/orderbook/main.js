import OrderbookTable from '@/components/orderbook-table'

import {
  toPairs
} from 'ramda'

import subscriptions from './subscriptions'
import * as computed from './computed'

const props = {
  broker: String,
  symbol: String
}

export default {
  name: 'orderbook',
  subscriptions,
  props,
  computed,
  components: {
    OrderbookTable
  }
}
