import OrderbookTable from '@/components/orderbook-table'

import {
  reverse,
  toPairs
} from 'ramda'

import subscriptions from './subscriptions'
import * as computed from './computed'

const filters = {
  reverse
}

export default {
  name: 'orderbook',
  subscriptions,
  computed,
  filters,
  components: {
    OrderbookTable
  }
}
