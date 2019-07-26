import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import './plugins/element.js'
import wx from 'weixin-js-sdk'

import {
  Input,
  Select,
  Option,
  TimePicker,
  DatePicker
} from 'element-ui';
Vue.config.productionTip = false
// Vue.protoType.stroage = STROAGE 
Vue.use(Input)
  .use(Select)
  .use(Option)
  .use(TimePicker)
  .use(DatePicker)
  .use(wx)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')