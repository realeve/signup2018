<template>
  <footer :style="{color}" :class="{bg:showBg}">
    {{year}} &copy; 中国印钞造币总公司
  </footer>
</template>
<style lang="less" scoped>
footer {
  padding-bottom: 10px;
  font-size: 14px;
  text-align: center;
}
.bg {
  background: url(../assets/footer.png) no-repeat;
  background-size: cover;
  height: 60px;
  background-position: bottom;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  position: absolute;
  bottom: 0;
}
</style>
<script>
export default {
  computed: {
    year() {
      let date = new Date();
      return date.getFullYear();
    }
  },
  props: {
    color: {
      default: "#333"
    },
    showBg: {
      default: true
    }
  }
};
</script>
