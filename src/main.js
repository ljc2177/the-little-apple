import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router'
import Home from './components/Home.vue';
import Bronx from './components/Bronx.vue';

Vue.config.productionTip = false

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', component: Home },
    { path: '/bronx', component: Bronx }
  ]
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')