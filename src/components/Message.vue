<template>
  <div>
    <x-header></x-header>
    <div class="content">
      <msg :title="title" :description="desc" icon="success"></msg>
    </div>
  </div>
</template>

<script>
import XHeader from "./Header";
import util from "../js/common";
import { Msg } from "vux";

export default {
  components: {
    XHeader,
    Msg
  },
  data() {
    return {
      title: "活动结束",
      desc: "活动已结束，感谢你的关注！"
    };
  },
  mounted() {
    let { status } = this.$route.query;
    if (typeof status === "undefined") {
      return;
    }
    if (status == 1) {
      this.title = "活动尚未开始";
      this.desc =
        "本活动将于" + this.$store.state.sport.startDate + "开始，敬请期待!";
    } else {
      this.desc =
        "本活动已于" + this.$store.state.sport.endDate + "结束，感谢你的关注!";
    }
  }
};
</script>

<style scoped lang="less">
.content {
  padding: 15px;
  padding-top: 10px;
  .info {
    display: flex;
    justify-content: center;
    font-size: 20px;
    width: 100%;
    border-bottom: 1px solid #ddd;
    padding-bottom: 5px;
  }
  .desc {
    padding-top: 5px;
    color: #636563;
    font-size: 14px;
  }
}
</style>
