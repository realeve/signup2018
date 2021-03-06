// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import FastClick from 'fastclick';
import App from './App';
import router from './router/index';

import store from './store';

import { WechatPlugin, ToastPlugin } from 'vux';
Vue.use(WechatPlugin);

Vue.use(ToastPlugin);

router.beforeEach(function(to, from, next) {
  store.commit('updateLoadingStatus', { isLoading: true });
  next();
});

router.afterEach(function(to) {
  store.commit('updateLoadingStatus', { isLoading: false });
});
FastClick.attach(document.body);

Vue.config.productionTip = false;

// import util from './js/common';

// Vue.config.errorHandler = function(e, vm, info) {
//   // handle error
//   // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
//   // 只在 2.2.0+ 可用
//   const state = vm.$store.state;

//   let err = util.handleErr(e);
//   err = Object.assign(err, {
//     hook: info,
//     remark: JSON.stringify(state)
//   });
//   console.log(err);
// };

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app-box');
