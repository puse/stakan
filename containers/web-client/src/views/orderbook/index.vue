<template lang="pug">
  el-row(:gutter="20")
    el-col(:span="12")
      h3 Buy orders
      orderbook-table(:dataset="bids")
    el-col(:span="12")
      h3 Sell orders
      orderbook-table(:dataset="asks")
</template>

<script src="./main.js"></script>
