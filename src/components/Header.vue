<template>
  <div class="header">
    <!-- <Pbc :size="120" /> -->
    <img class="logo" src="../assets/header.jpg">
    <div class="title">
      <!-- <h2>中国人民银行</h2> -->
      <h2>改革开放40周年货币金银大事<br>评选候选事件
      </h2>
      <h4 class="subtitle">（排名不分先后）</h4>
    </div>
  </div>
</template>

<style scoped lang="less">
.header {
  text-align: center;
  margin-bottom: 70px;
  position: relative;
  .title {
    h4 {
      font-weight: 200;
    }
    margin-top: -150px;
    color: #fff;
    margin-bottom: 60px;
    .subtitle {
      padding-top: 10px;
    }
  }
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
