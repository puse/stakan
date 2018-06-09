<template lang="pug">
  div
    el-row(:gutter="20")

      el-col(:span="12")
        h3 Sell orders
        orderbook-table(
          v-if="asks"
          :dataset="asksData")

      el-col(:span="12")
        h3 Buy orders
        orderbook-table(
          v-if="bids"
          :dataset="bidsData")
</template>

<script src="./main.js"></script>
