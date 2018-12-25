<template lang="pug">
  div
    header.status-bar.clearfix
      el-breadcrumb(separator-class="el-icon-arrow-right")
        el-breadcrumb-item {{ broker }}
        el-breadcrumb-item {{ symbol }}

      div.float-right
        el-button(
          size="small"
          icon="el-icon-caret-bottom"
          type="danger")
          | {{ticker.bid.price}}

        el-button(
          size="small"
          icon="el-icon-caret-top"
          type="success")
          | {{ticker.ask.price}}

    el-row(v-if="snapshot$"
      :gutter="20")

      el-col(:span="12")

        l2-table(side="bids"
          :members="orders.bids")

      el-col(:span="12")

        l2-table(side="asks"
          :members="orders.asks")
</template>

<script src="./main.js"></script>

<style scoped>
.el-breadcrumb {
  display: inline-block;
}

.status-bar {
  padding: 15px 0;
  border-bottom: 1px solid #ddd;
  margin-bottom: 25px;
}

</style>
