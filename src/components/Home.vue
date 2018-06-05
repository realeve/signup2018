<template>
  <div>
    <x-header></x-header>
    <toast v-model="toast.show" :type="toast.type">{{ toast.text }}</toast>
    <div style="margin-top:-30px;">
      <div class="vote">
        <div>
          投票前请选择您所属单位及地区
          <group>
            <selector title="单位" :options="deptList" v-model="dept_id"></selector>
            <selector title="下属企业" :options="companyList" v-show="dept_id==35" v-model="company_name"></selector>
            <x-address title="地区" v-model="address" raw-value :list="addressData" :required="true" value-text-align="right"></x-address>
          </group>
        </div>
      </div>
      <div class="vote" v-for="(item,i) in checkList" :key="item.id" v-show="showVoteInfo">
        <p class="title">{{i+1}}.{{item.title}}</p>
        <div class="card-content">
          <!-- <transition name="v-transition" enter-active-class="animated zoomIn" leave-active-class="animated slideOutLeft">
            <p class="desc animated" v-show="valueList[i]">{{item.content}}</p>
          </transition> -->
          <p class="desc">{{item.content}}</p>
          <div class="switch">
            <!-- <span>选中本项查看详情</span> -->
            <span>{{progress}}</span>
            <input type="checkbox" class="weui-switch" v-model="valueList[i]" @on-change="checkMaxVotes(i)">
          </div>
        </div>
      </div>
    </div>

    <p style="margin-top:20px;" v-show="myChecked.length">我的选择</p>
    <div class="weui-cells weui-cells_checkbox">
      <label class="weui-cell weui-check_label" v-for="(item,i) in myChecked" :key="item.id">
        <div class="weui-cell__bd">
          <p>{{i+1}}.{{item.title}}</p>
        </div>
      </label>
    </div>

    <div class="submit" v-show="showVoteInfo">
      <x-button :disabled="maxnum == 0 || maxnum>sport.maxTickets" @click.native="submit" type="primary">提交数据</x-button>
      <!-- <x-button @click.native="addInfo" type="default">填写个人信息</x-button> -->
    </div>

    <div v-transfer-dom>
      <confirm v-model="showModel" title="确认提交" @on-cancel="onCancel" @on-confirm="doSubmit">
        <p style="text-align:center;" v-if="maxnum < sport.maxTickets">当前共选择{{ maxnum }}项,还可投{{sport.maxTickets - maxnum}}票,是否继续提交?</p>
        <p style="text-align:center;" v-else>当前共选择{{ maxnum }}项,是否继续提交?</p>
      </confirm>
    </div>
    <x-footer showBg="true" :class="{'fix-bottom':!showVoteInfo}" />
  </div>

</template>

<script>
import {
  Sticky,
  Group,
  Cell,
  Card,
  Divider,
  Toast,
  XButton,
  Selector,
  Confirm,
  XAddress,
  TransferDomDirective as TransferDom,
  Value2nameFilter as value2name
} from "vux";
import XFooter from "./Footer";
import XHeader from "./Header2";
import _checkList from "../js/checkList";
import companyList from "../js/companyList";

import depts from "../js/deptList";
import util from "../js/common";
import md5 from "md5";
import { mapState } from "vuex";

import ChinaAddressV4Data from "./vux_china_address_v4.json";
import moment from "moment";

export default {
  directives: {
    TransferDom
  },
  components: {
    Sticky,
    Group,
    Cell,
    Divider,
    Card,
    Toast,
    XButton,
    XHeader,
    XFooter,
    Confirm,
    Selector,
    XAddress
  },
  data() {
    return {
      depts,
      valueList: [],
      toast: {
        show: false,
        text: "",
        type: ""
      },
      voteNum: [],
      checkList: _checkList, //util.randomArr(_checkList),
      time: new Date().getTime(),
      signature: "",
      showModel: false,
      dept_id: -1,
      addressData: ChinaAddressV4Data,
      address: [],
      companyList,
      company_name: ""
    };
  },
  computed: {
    ...mapState(["cdnUrl", "sport", "userInfo"]),
    maxnum() {
      let count = this.valueList.filter(item => item);
      if (count.length > this.sport.maxTickets) {
        this.showToast({
          text: "请勿超过" + this.sport.maxTickets + "票",
          type: "warn"
        });
      }
      return count.length;
    },
    showVoteInfo() {
      return this.dept_id > -1 && this.address.length;
    },
    openid() {
      return this.userInfo.openid;
    },
    curTimeStamp() {
      return (new Date().getTime() / 1000).toFixed(0);
    },
    progress() {
      return this.maxnum + "/" + this.sport.maxTickets;
    },
    myChecked() {
      let arr = [];
      this.checkList.forEach((item, i) => {
        if (this.valueList[i]) {
          arr.push(item);
        }
      });
      return arr;
    },
    isSportEnd() {
      return moment().format("YYYY-MM-DD") > this.sport.endDate;
    },
    isSportNotStart() {
      return moment().format("YYYY-MM-DD") < this.sport.startDate;
    },
    deptList() {
      let list = depts;
      return list.map((value, key) => ({ key, value }));
    }
  },
  filters: {
    chinese(i) {
      let num = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
      let ten = ["", "二", "三", "四", "五", "六", "七", "八", "九"];
      if (i < 9) {
        return num[i];
      }
      let tenId = Math.floor(i / 10);
      let numId = i % 10;
      return numId == 9
        ? ten[tenId] + "十"
        : ten[tenId - 1] + "十" + num[numId];
    }
  },
  methods: {
    getSignature() {
      this.time = new Date().getTime();
      this.signature = md5(
        btoa(
          this.sport.salt + this.time + this.openid + this.openid.toUpperCase()
        )
      );
    },
    showToast(settings) {
      this.toast.text = settings.text;
      this.toast.type = settings.type;
      this.toast.show = true;
      setTimeout(() => {
        this.toast.show = false;
      }, 1500);
    },
    checkMaxVotes(i) {
      if (this.maxnum > this.sport.maxTickets) {
        this.showToast({
          text: "请勿超过" + this.sport.maxTickets + "票",
          type: "warn"
        });
      }
    },
    getOriginIdx(newIdx) {
      return this.checkList[newIdx].id;
    },
    onCancel() {
      this.showModel = false;
    },
    getName(value) {
      return value2name(value, ChinaAddressV4Data);
    },
    doSubmit() {
      this.getSignature();
      let arr = [];
      this.valueList.forEach((item, i) => {
        if (item) {
          arr.push(i);
        }
      });
      let addStr = arr
        .map(item => this.getOriginIdx(item))
        .sort((a, b) => a - b);

      let address = this.getName(this.address).split(" ");
      let company_name = this.dept_id != 35 ? "" : this.company_name;
      let params = {
        s: "/addon/Api/Api/addVoteInfo",
        sid: this.sport.id,
        timestamp: this.time,
        signature: this.signature,
        addstr: addStr.join(","),
        company_name,
        openid: this.userInfo.openid,
        nickname: this.userInfo.nickname,
        sex: this.userInfo.sex,
        city: this.userInfo.city,
        province: this.userInfo.province,
        country: this.userInfo.country,
        headimgurl: this.userInfo.headimgurl,
        dept_id: this.dept_id,
        prov_name: address[0],
        city_name: address[1],
        area_name: address[2]
      };

      // this.showToast({
      //   text: "测试时不提交数据",
      //   type: "warn"
      // });
      // console.log(params);
      // return;
      let url = this.cdnUrl;
      this.$http
        .jsonp(url, {
          params
        })
        .then(res => {
          if (!res.ok) {
            this.showToast({
              text: "数据提交失败",
              type: "warn"
            });
            return;
          }
          var data = res.data;
          if (data.status > "0") {
            this.showToast({
              text: data.title,
              type: "success"
            });
            // 跳转提交用户信息
            setTimeout(() => {
              this.$router.push("/score");
            }, 500);
          } else {
            this.showToast({
              text: data.title,
              type: "warn"
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    submit() {
      this.showModel = true;
    },
    getUserAddr() {
      let url = this.cdnUrl;
      let params = {
        s: "/addon/Api/Api/getUserAddr",
        openid: this.openid
      };
      this.$http
        .jsonp(url, {
          params
        })
        .then(({ data }) => {
          if (data.length === 0) {
            return;
          }
          let { prov_name, city_name, area_name } = data[0];
          this.address = [prov_name, city_name, area_name];
        });
    },
    getStep() {
      let url = this.cdnUrl;
      let params = {
        s: "/addon/Api/Api/isSetUserInfo",
        openid: this.openid,
        sid: this.sport.id
      };
      this.$http
        .jsonp(url, {
          params
        })
        .then(res => {
          var data = res.data;
          // console.log(data);
          if (data.status > 1) {
            this.$router.push("/score");
          } else if (this.isSportNotStart) {
            this.$router.push("/message?status=1");
          } else if (this.isSportEnd) {
            this.$router.push("/message?status=2");
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    auth() {
      if (this.userInfo.openid == null) {
        this.$router.push("/follow");
        return false;
      }
      return true;
    },
    init() {
      if (!this.$store.state.isDebug) {
        let passed = this.auth();
        if (!passed) {
          return;
        }
      }
      this.getUserAddr();
      this.getStep();
      this.valueList = new Array(_checkList.length).fill(false);
      this.showList = new Array(_checkList.length).fill(false);
    }
    // addInfo() {
    //   this.$router.push("/info");
    // }
  },
  created() {
    this.init();
  }
};
</script>

<style scoped lang="less">
@import "../assets/css/switch.css";
.switch {
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
}

.vote {
  background: #fff;
  position: relative;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.4), 0 5px 30px 0 rgba(0, 0, 0, 0.15);
  border-radius: 3px;
  margin: 20px 10px;
  padding: 10px 5px;
  // background: url("../assets/card.png") no-repeat;
  // background-size: cover;
  // background-position: 50% 100%;
  // background-origin: content-box;

  .title {
    color: #e6232b;
    color: #333;
    font-size: 18px;
    text-align: left;
    padding: 0 5px 10px 5px;
    font-weight: bold;
    border-bottom: 1px solid #eee;
  }

  .card-content {
    margin: 10px 15px 0px 15px;
    .desc {
      // padding-top: 10px;
      padding-bottom: 10px;
      font-size: 16px;
      line-height: 1.6em;
      text-indent: 2.3em;
      letter-spacing: 0.15em;
      text-align: left;
      // border-top: 1px solid #eee;
      // border-bottom: 1px solid #eee;
      font-weight: normal;
    }
    &:before {
      content: "";
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 50px;
      overflow: hidden;
      box-shadow: 0 1px 1px rgb(214, 214, 214), 0 8px 0 -3px #f6f6f6,
        0 9px 1px -3px #b1b1b1;
    }
  }
  .weui-panel:before {
    border: none;
  }
}

// .v-transition-leave-active,
// .v-transition-enter-active {
//   transition: all 1s ease;
// }
// .v-transition-leave-to,
// .v-transition-enter {
//   opacity: 0;
//   height: 0px;
// }

.submit {
  margin: 10px 15px 5px 15px;
}
.weui-cell__bd p {
  text-align: left;
}
.fix-bottom {
  position: absolute;
  bottom: 0;
}
</style>
