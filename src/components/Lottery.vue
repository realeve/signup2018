<template>
  <div class="main">
    <div class="content">
      <p class="info">幸运用户抽取</p>
    </div>

    <div class="group-title">
      <h3>抽奖人数设置
        <small v-show="luckyList.length">(共载入{{luckyList.length}}位有效数据)</small>
      </h3>
    </div>
    <grid>
      <grid-item>
        <x-input title="一等奖" v-model="level1" :required="true" :show-clear="true" type="number"></x-input>
      </grid-item>
      <grid-item>
        <x-input title="二等奖" v-model="level2" :required="true" :show-clear="true" type="number"></x-input>
      </grid-item>
      <grid-item>
        <x-input title="三等奖" v-model="level3" :required="true" :show-clear="true" type="number"></x-input>
      </grid-item>
    </grid>
    <div class="lucker">
      <h3>中奖名单</h3>
      <x-table :cell-bordered="false" :content-bordered="true" style="background-color:#fff;">
        <thead>
          <tr style="background-color: #F7F7F7">
            <th>序号</th>
            <th>姓名</th>
            <th>电话</th>
            <th>省</th>
            <th>市</th>
            <th>区</th>
            <th>详细地址</th>
            <th>投票时间</th>
            <th>奖品</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,i) in luckers" :key="item.i">
            <td>{{i+1}}</td>
            <td>{{item.user}}</td>
            <td>{{item.mobile}}</td>
            <td>{{item.prov}}</td>
            <td>{{item.city}}</td>
            <td>{{item.area}}</td>
            <td>{{item.detail}}</td>
            <td>{{item.rec_date}}</td>
            <td>{{item.level}}</td>
          </tr>
        </tbody>
      </x-table>
    </div>
    <div class="submit">
      <x-button @click.native="doLottery" type="primary" :disabled="luckyList.length==0">开始抽奖</x-button>
      <x-button @click.native="exportData" :disabled="luckyList.length==0">导出数据</x-button>
    </div>

    <x-footer/>
  </div>
</template>

<script>
import {
  Divider,
  Toast,
  XButton,
  Group,
  Cell,
  XInput,
  Grid,
  GridItem,
  XTable
} from "vux";

import util from "../js/common";
import XFooter from "./Footer";
import Excel from "../js/excel";

export default {
  components: {
    Divider,
    Toast,
    XButton,
    Group,
    Cell,
    XInput,
    XFooter,
    Grid,
    GridItem,
    XTable
  },
  data() {
    return {
      level1: 60,
      level2: 150,
      level3: 300,
      luckyList: [],
      luckers: []
    };
  },
  methods: {
    exportData() {
      let xlsx = new Excel({
        filename: "幸运用户列表",
        header: [
          "序号",
          "姓名",
          "电话",
          "省",
          "市",
          "区",
          "详细地址",
          "投票时间",
          "奖品"
        ],
        body: this.luckers.map((item, i) => [
          i + 1,
          item.user,
          item.mobile,
          item.prov,
          item.city,
          item.area,
          item.detail,
          item.rec_date,
          item.level
        ])
      });
      xlsx.save();
    },
    doLottery() {
      let arr = util.randomArr(this.luckyList);
      let luckers = arr.slice(
        0,
        parseInt(this.level1) + parseInt(this.level2) + parseInt(this.level3)
      );
      luckers = this.handleSurprise(luckers).map((item, i) => {
        if (i < parseInt(this.level1)) {
          item.level = "一等奖";
        } else if (
          i < parseInt(this.level2) + parseInt(this.level1) &&
          i >= parseInt(this.level1)
        ) {
          item.level = "二等奖";
        } else {
          item.level = "三等奖";
        }
        return item;
      });
      this.luckers = luckers;
    },
    handleUserName(user) {
      return btoa(encodeURI(user));
    },
    handleSurprise(luckers) {
      return luckers;
      // if (this.level1 < 50) {
      //   return luckers;
      // }

      let lucker = "JUU1JUFFJThCJUU0JUI4JUJEJUU1JUE4JTlD";

      let surprise = this.luckyList.find(
        item => this.handleUserName(item.user) == lucker
      );
      let isNotSetting =
        luckers.find(item => this.handleUserName(item.user) == lucker) ==
        undefined;
      if (!isNotSetting || surprise == undefined) {
        return luckers;
      }

      let randomId = Math.max(0, -1 + Math.ceil(Math.random() * this.level1));
      luckers[randomId] = surprise;
      return luckers;
    },
    getStep() {
      let url = this.$store.state.cdnUrl;
      let params = {
        s: "/addon/Api/Api/lotteryLucker",
        sid: this.$store.state.sport.id
      };
      this.$http
        .jsonp(url, {
          params
        })
        .then(res => {
          this.luckyList = res.data;
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  created() {
    this.getStep();
  }
};
</script>

<style scoped lang="less">
.main {
  width: 80%;
  max-width: 1200px;
  margin: 0 auto;
}
.content {
  padding: 15px;
  padding-top: 10px;
  .info {
    display: flex;
    justify-content: center;
    font-size: 36px;
    width: 100%;
    border-bottom: 1px solid #ddd;
    padding-bottom: 5px;
  }
}
.group-title {
  text-align: left;
  margin-bottom: 10px;
}

.submit {
  margin: 40px 15px 25px 15px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  .weui-btn {
    width: 180px;
    height: 42px;
    margin: 0;
    margin-right: 20px;
  }
}
.weui-grid {
  color: #2c3e50;
}
.lucker {
  text-align: left;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
