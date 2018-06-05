<template>
  <div class="pbc-logo" :style={width,height}></div>
</template>
<style lang="less" scoped>
.pbc-logo {
  background: url("../assets/pbc.svg") no-repeat;
  position: absolute;
  top: 30%;
  opacity: 0.2;
  background-size: contain;
  animation: logoRotate 30s linear infinite;
}
@keyframes logoRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
<script>
export default {
  name: "pbc",
  props: {
    size: {
      default: 250
    }
  },
  computed: {
    width() {
      return this.size + "px";
    },
    height() {
      return this.size + "px";
    }
  }
};
</script>
