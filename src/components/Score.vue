<template>
  <div>
    <x-header></x-header>
    <div class="score-content">
      <p class="info"> 票数汇总 </p>
      <!-- <p class="desc" v-if="isAdmin">信息填写: {{countInfo.address}} / {{countInfo.alls}}</p>
      <p class="desc" v-if="isAdmin">投票情况: {{luckers}} 人选对{{sport.maxTickets}}项</p> 你所投的{{voteNum.length}}位 -->
      <p class="desc">{{sport.name}}评选截止目前总票数如下 </p>
      <group>
        <cell v-for="user in voteNum" :title="user.id+'.'+user.vote_name+'(第'+user.asc_id+'位，'+user.percent+'%)'" :value="user.vote_nums+' 票'" :key="user.id"></cell>
      </group>
    </div>
    <p class="info"> 各地区参与人数汇总 </p>
    <group style="margin-bottom:20px;">
      <cell v-for="(item,i) in provInfo" :title="item.prov" :value="item.num+' 票'" :key="i"></cell>
    </group>
    <div style="margin:0 20px 20px 20px;">
      <x-button @click.native="init" type="primary">刷新数据</x-button>
    </div>
    <x-footer/>
  </div>
</template>

<script>
import XHeader from "./Header2";
import { Cell, Group, Toast, XButton } from "vux";
import util from "../js/common";

import { mapState } from "vuex";
import XFooter from "./Footer";
export default {
  components: {
    XHeader,
    XButton,
    Cell,
    Group,
    Toast,
    XFooter
  },
  data() {
    return {
      voteNum: [],
      countInfo: {
        alls: "",
        address: ""
      },
      luckers: "",
      provInfo: ""
    };
  },
  computed: {
    ...mapState(["cdnUrl", "sport", "userInfo"]),
    openid() {
      return this.userInfo.openid;
    },
    isAdmin() {
      return (
        [
          "oW0w1v4qftC8xUP3q-MPIHtXB7hI",
          "oW0w1v28ykr6042MA2XnccUlMsVg",
          "oW0w1vxG2WkLPHu6d1tgZVQ_SyC8"
        ]
          .join(" ")
          .indexOf(this.openid) > -1
      );
    }
  },
  methods: {
    showToast(settings) {
      this.toast.text = settings.text;
      this.toast.type = settings.type;
      this.toast.show = true;
      setTimeout(() => {
        this.toast.show = false;
      }, 1500);
    },
    getVoteNums() {
      let url = this.cdnUrl;

      let params = {
        sid: this.sport.id,
        openid: this.openid
      };
      // if (this.isAdmin) {
      //   params = {};
      // }

      params.s = "/addon/Api/Api/getVoteCount";

      this.$http
        .jsonp(url, {
          params
        })
        .then(res => {
          if (!res.ok) {
            this.showToast({
              text: "票数获取失败",
              type: "warn"
            });
            return;
          }
          res.data.map((item, id) => {
            item.id = id + 1;
            return item;
          });
          let ascData = res.data.sort(
            (b, a) => parseInt(a.vote_nums) - parseInt(b.vote_nums)
          );
          let sum = 0;
          ascData.map((item, asc_id) => {
            item.asc_id = asc_id + 1;
            sum += parseInt(item.vote_nums);
            return item;
          });
          ascData.sort((b, a) => b.id - a.id);
          ascData.map(item => {
            item.percent = (item.vote_nums / sum * 100).toFixed(2);
            return item;
          });
          this.voteNum = ascData;
          // console.log(ascData);
        })
        .catch(e => {
          console.log(e);
        });
    },
    // getCountInfo() {
    //   let url = this.cdnUrl + "?s=/addon/Api/Api/countVoteInfo";

    //   this.$http
    //     .jsonp(url, {
    //       params: {
    //         sid: this.$store.state.sport.id
    //       }
    //     })
    //     .then(res => {
    //       this.countInfo = res.data[0];
    //     })
    //     .catch(e => {
    //       console.log(e);
    //     });
    // },
    // getPrizeInfo() {
    //   let url = this.cdnUrl + "?s=/addon/Api/Api/countPrizeInfo";

    //   this.$http
    //     .jsonp(url, {
    //       params: {
    //         sid: this.$store.state.sport.id,
    //         max: this.$store.state.sport.maxTickets
    //       }
    //     })
    //     .then(res => {
    //       this.luckers = res.data[0].luckers;
    //     })
    //     .catch(e => {
    //       console.log(e);
    //     });
    // },
    getVoteByProv() {
      let url =
        this.cdnUrl + "?s=/addon/Api/Api/countVoteByProv&sid=" + this.sport.id;

      this.$http
        .jsonp(url)
        .then(res => {
          this.provInfo = res.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    init() {
      this.getVoteNums();
      // if (this.isAdmin) {
      // this.getCountInfo();
      // this.getPrizeInfo();
      // this.getVoteByProv();
      // }
      this.getVoteByProv();
    }
  },
  created() {
    if (this.openid == null) {
      this.$router.push("/follow");
      return;
    }
    this.init();
  }
};
</script>

<style lang="less" >
.score-content {
  padding: 0 15px 15px 15px;
  // padding-top: 10px;
  .info {
    font-size: 20px;
    font-weight: bold;
    padding-bottom: 5px;
    padding-left: 10px;
  }
  .desc {
    padding-top: 5px;
    color: #636563;
    font-size: 16px;
    text-align: left;
  }
  .vux-label {
    text-align: left;
  }
  .vux-cell-primary {
    text-align: left;
  }
}
</style>
