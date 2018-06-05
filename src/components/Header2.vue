<template>
  <div class="header">
    <!-- <Pbc :size="180" /> -->
    <img class="logo" src="../assets/header3.jpg">
  </div>
</template>

<style scoped lang="less">
.header {
  text-align: center;
  // margin-bottom: 20px;
  position: relative;
  .logo {
    width: 100%;
    height: 100%;
  }
}
</style>
<script>
import Pbc from "./Pbclogo";
export default {
  components: {
    Pbc
  }
};
</script>
