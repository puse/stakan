<template lang="pug">
  div
    el-row(v-if="snapshot$"
      :gutter="20")

      el-col(:span="12")
        h3 Sell orders
        orderbook-table(:members="bids")

      el-col(:span="12")
        h3 Buy orders
        orderbook-table(:members="asks")
</template>

<script src="./main.js"></script>
