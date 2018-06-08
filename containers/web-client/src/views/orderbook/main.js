import OrderbookTable from '@/components/orderbook-table'

import {
  toPairs
} from 'ramda'

import subscriptions from './subscriptions'

export default {
  name: 'orderbook',
  subscriptions,
  components: {
    OrderbookTable
  }
}
