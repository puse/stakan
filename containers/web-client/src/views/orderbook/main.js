import OrderbookTable from '@/components/orderbook-table'

import {
  toPairs
} from 'ramda'

import subscriptions from './subscriptions'
import * as computed from './computed'

export default {
  name: 'orderbook',
  subscriptions,
  computed,
  components: {
    OrderbookTable
  }
}
