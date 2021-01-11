import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import Firebase from "./firebase";
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'

Firebase.init();

Vue.config.productionTip = false
Vue.use(VueAxios, axios)

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
