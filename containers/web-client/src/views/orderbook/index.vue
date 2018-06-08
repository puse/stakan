<template lang="pug">
  div
    el-row(:gutter="20")

      el-col(:span="12")
        h3 Sell orders
        orderbook-table(
          v-if="asks"
          :dataset="asks")

      el-col(:span="12")
        h3 Buy orders
        orderbook-table(
          v-if="bids"
          :dataset="bids")
</template>

<script src="./main.js"></script>
