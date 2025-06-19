<script setup>
import router from './router';
const routes = router.getRoutes().map(({ path, name }) => ({
  name: name || (path === '/' ? '首页' : '无'),
  path: path,
}))
</script>

<template>
  <el-select class="select">
    <el-option v-for="{ path, name } in routes" @click="router.push(path)" :label="name" :key="path">
    </el-option>
  </el-select>


  <router-view />
</template>

<style scoped>
.select {
  width: 250px;
  display: block;
}
</style>