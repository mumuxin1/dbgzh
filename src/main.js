import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import './plugins/element.js'

import { Input, Select, Option, TimePicker  } from 'element-ui';
Vue.config.productionTip = false
// Vue.protoType.stroage = STROAGE 
Vue.use(Input)
.use(Select)
.use(Option)
.use(TimePicker)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
