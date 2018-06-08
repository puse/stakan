<template lang="pug">
  el-container
    el-header
      | Exo
    el-main.wrapper
      router-view
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
.wrapper {
  width: 960px;
  margin: 20px auto;
}
</style>
