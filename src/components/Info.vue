<template>
  <div>
    <template v-if="!hasUserInfo">
      <div class="content">
        <p class="info">个人信息</p>
        <p
          class="desc"
          style="text-align:center;"
        >报名人数：{{curPeople}}</p>
        <p class="desc">请务必填写本人身份证号码，正式入厂参观需携带身份证原件，并以报名时预留的身份证号为准。</p>
      </div>
      <group
        label-width="4.5em"
        label-margin-right="2em"
        label-align="right"
      >
        <x-input
          title="姓名"
          v-model="user"
          placeholder="请填写参观人姓名"
          :required="true"
          :show-clear="true"
        ></x-input>
        <x-input
          title="手机号"
          is-type="china-mobile"
          v-model="mobile"
          :show-clear="true"
          :required="true"
          placeholder="请输入手机号"
        ></x-input>
        <x-input
          title="身份证"
          v-model="idcard"
          :show-clear="true"
          :required="true"
          placeholder="请输入身份证号"
        ></x-input>
        <selector
          title="参观单位"
          :options="depts"
          v-model="dept"
        ></selector>
        <x-address
          title="地区"
          v-model="address"
          raw-value
          :list="addressData"
          :required="true"
          value-text-align="left"
        ></x-address>
        <x-textarea
          title="详细地址"
          placeholder="请填写详细地址"
          v-model="detail"
          :required="true"
          :show-counter="false"
          :show-clear="true"
          :rows="3"
        ></x-textarea>
      </group>
    </template>
    <msg
      v-else
      :title="msg.title"
      :description="msg.desc"
      :icon="msg.icon"
    ></msg>
    <toast
      v-model="toast.show"
      :type="toast.type"
    >{{toast.text}}</toast>

    <div class="submit">
      <x-button
        v-show="!hasUserInfo"
        @click.native="submit"
        type="primary"
      >提交数据</x-button>
    </div>

    <x-footer />
  </div>
</template>

<script>
import {
  Msg,
  Divider,
  Toast,
  XTextarea,
  XAddress,
  XButton,
  Group,
  Cell,
  XInput,
  Selector,
  PopupPicker,
  Picker,
  Value2nameFilter as value2name
} from "vux";

import ChinaAddressV4Data from "./vux_china_address_v4.json";

import util from "../js/common";
import XFooter from "./Footer";
import idcard from "../js/idcard";
import * as db from "../js/db";

const addressData = ChinaAddressV4Data.filter(
  item =>
    ["210000", "310000", "210100", "310100", "320000", "320100"].includes(
      item.value
    ) || ["210100", "310100", "320100"].includes(item.parent)
);

export default {
  components: {
    Cell,
    Toast,
    XButton,
    Group,
    XAddress,
    XTextarea,
    XInput,
    PopupPicker,
    Picker,
    XFooter,
    Msg,
    Divider,
    Selector
  },
  data() {
    return {
      addressData,
      toast: {
        show: false,
        text: "",
        type: ""
      },
      curPeople: "",
      user: "",
      mobile: "",
      detail: "",
      idcard: "",
      address: ["辽宁省", "沈阳市", "和平区"],
      depts: [
        { key: "南币", value: "南币" },
        { key: "沈币", value: "沈币" },
        { key: "上币", value: "上币" }
      ],
      showScore: false,
      hasUserInfo: false,
      showError: false,
      dept: "南币",
      msg: {
        title: "个人信息提交成功",
        desc: "感谢你的参与",
        icon: "success"
      }
    };
  },
  computed: {
    openid() {
      return this.$store.state.userInfo.openid;
    }
  },
  watch: {
    openid() {
      this.getStep();
    }
  },
  methods: {
    getName(value) {
      return value2name(value, ChinaAddressV4Data);
    },
    validateData() {
      return !(
        this.user.trim().lenth === 0 ||
        this.mobile.trim().length === 0 ||
        this.detail.trim().length === 0 ||
        this.idcard.trim().length === 0
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
    async submit() {
      let address = this.getName(this.address).split(" ");
      if (!idcard.validate(this.idcard).status) {
        this.showToast({
          text: "身份证校验失败",
          type: "warn"
        });
        return;
      }
      if (!this.validateData()) {
        this.showToast({
          text: "数据校验失败",
          type: "warn"
        });
        return;
      }

      let params = {
        user: this.user,
        mobile: this.mobile,
        prov: address[0],
        city: address[1],
        area: address[2],
        detail: this.detail,
        openid: this.openid,
        rec_time: util.getNow(),
        idcard: this.idcard,
        sid: this.$store.state.sport.id,
        dept: this.dept
      };

      let { data, rows } = await db.addCbpmSignup613(params).catch(e => {
        this.hasUserInfo = true;
        this.msg.title = "糟糕了，信息提交失败";
        this.msg.icon = "warn";
        Reflect.deleteProperty(params, "callback");

        params.status = e.status;
        params.statusText = e.statusText;
        this.showError = true;
        this.msg.desc =
          '请复制以下信息并<a href="http://mp.weixin.qq.com/s/vFPSwUi1RxD1FJJqTzK93w">点击此处提交至后台小编</a>：<br><br>' +
          JSON.stringify(params);
        return { data: [{ affected_rows: 0 }] };
      });

      if (data[0].affected_rows == 0) {
        this.showToast({
          text: "提交失败",
          type: "warn"
        });
        return;
      }
      this.showToast({
        text: "提交成功",
        type: "success"
      });

      this.msg.desc = "感谢你的参与";

      let {
        data: [{ num }]
      } = await db.getCbpmSignup613();
      this.curPeople = num;
      this.msg.desc = "感谢你的参与,当前已有 " + num + " 人报名.";
      this.msg.title = "个人信息提交成功";
      this.msg.icon = "success";
      this.hasUserInfo = true;
    },
    async getStep() {
      if (typeof this.openid == "undefined" || this.openid == "") {
        return;
      }

      let {
        rows,
        data: [data]
      } = await db.getCbpmSignup613ByOpenid(this.openid);
      if (rows == 0) {
        return;
      }
      this.dept = data.dept;
      this.user = data.user;
      this.mobile = data.mobile;
      this.detail = data.detail;
      this.address = [data.prov, data.city, data.area];
      this.idcard = data.idcard;

      let {
        data: [{ num }]
      } = await db.getCbpmSignup613();

      this.curPeople = num;
    }
  },
  created() {
    this.getStep();
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
    text-indent: 2em;
  }
}

.vote {
  margin-bottom: 25px;
  .vux-divider {
    font-size: 24px;
    color: #333;
  }
}

.submit {
  margin: 10px 15px 25px 15px;
}
</style>
