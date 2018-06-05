<template>
  <div class="wrapper">
    <div class="content">
      <Pbc/>
      <div class="btn-wrapper">
        <div class="weui-btn weui-btn_default" @click="jump('home')">开始投票</div>
      </div>
    </div>
    <div class="canvas" id="home"></div>
    <x-footer color="#000" :showBg="false" />
  </div>
</template>
<script>
import particles from "particles.js";
import particlesSetting from "../js/particlesSetting";

import XFooter from "./Footer";
import Pbc from "./Pbclogo";
export default {
  components: {
    XFooter,
    Pbc
  },
  methods: {
    jump(router) {
      this.$router.push(router);
    }
  },
  mounted() {
    particlesJS("home", particlesSetting);
    document.title = this.$store.state.sport.name;
  }
};
</script>
<style lang="less" scoped>
.wrapper {
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  // background-color: #e33e3e;
  background: url("../assets/main.jpg") no-repeat;
  background-size: cover;
  background-position: 50% 100%;
  background-origin: content-box;
}

.content {
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
  font-size: 13pt;
  color: #333;
  width: 100%;
  justify-content: center;
  margin-bottom: 20px;
  .btn-wrapper {
    position: absolute;
    bottom: 33%;
    width: 40%;
    font-size: 10pt;
    opacity: 0.9;
    p {
      padding-bottom: 10px;
    }
  }
}

.canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.weui-btn_default {
  background: #e92a27;
  color: #fafafa;
  &:hover {
    color: #fafafa;
    background-color: #f36853;
  }
}

.weui-btn:after {
  border-color: rgba(255, 255, 255, 0.5);
}
</style>
