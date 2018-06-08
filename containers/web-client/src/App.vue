<template lang="pug">
  el-container
    el-header
      | Exo
    el-main
      router-view.wrapper
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
