<template lang="pug">
el-tooltip(
  placement="left"
  :content="displayValue")

    time.el-icon-time(:datetime="value")
</template>

<script src="./main.js"> </script>

<style scoped>
time {
  color: #666;
}
</style>
