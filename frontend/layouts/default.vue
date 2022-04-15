<template>
  <div>
    <nav-bar />
    <nuxt />
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue';
export default {
  components: { NavBar },
};
</script>

<style>
* {
  font-size: 14px;
}

.table-wrapper {
  height: calc(100vh - 92px);
}
</style>
