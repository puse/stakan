<template lang="pug">
el-tooltip(
  placement="left"
  :content="displayValue"
  )
    time.el-icon-time(
      :datetime="value"
      )
</template>

<script src="./main.js"> </script>

<style scoped>
time {
  padding: 5px 0;
  line-height: 22px;
  font-family: monospace;
  color: #666;
}
</style>
