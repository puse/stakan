import Vue from 'vue'
import Router from 'vue-router'

import Orderbook from '@/views/orderbook'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: {
        name: 'orderbook',
        params: {
          broker: 'cexio',
          symbol: 'btc-usd'
        }
      }
    }, {
      name: 'orderbook',
      path: '/orderbook/:broker/:symbol',
      component: Orderbook
    }
  ]
})
