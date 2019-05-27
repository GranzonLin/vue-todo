import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from '@/Request/Axios'
import store from './store'
import FontAwesomeIcon from '@/utils/FontAwsomeImporter'

Vue.config.productionTip = false;
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.prototype.$axios = axios;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
