import Vue from 'vue'
import App from './App.vue'
import ViInput from './components/input.vue'

Vue.config.productionTip = false
Vue.component('ViInput', ViInput)

new Vue({
  render: h => h(App),
}).$mount('#app')
