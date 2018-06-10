<template lang="pug">
  div
    el-row(:gutter="20")

      el-col(:span="12")
        h3 Sell orders
        orderbook-table(
          v-if="stream"
          :dataset="asksData")

      el-col(:span="12")
        h3 Buy orders
        orderbook-table(
          v-if="stream"
          :dataset="bidsData")
</template>

<script src="./main.js"></script>
