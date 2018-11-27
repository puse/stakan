import L2Table from '@/components/l2-table'

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
    L2Table
  }
}
