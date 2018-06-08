<template lang="pug">
  div
    el-row
      pre
        code {{ bids }}
    el-row(:gutter="20")

      el-col(:span="12")
        h3 Buy orders
        orderbook-table(
          v-if="bids"
          :dataset="bids")

      el-col(:span="12")
        h3 Sell orders
        orderbook-table(:dataset="asksData")
</template>

<script src="./main.js"></script>
