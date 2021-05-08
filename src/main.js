import Vue from 'vue'
import App from './App.vue'
import VueElectron from 'vue-electron'
Vue.use(VueElectron)
Vue.config.productionTip = false
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import './utils/electronUtil'
import router from './router'

Vue.use(Antd)
new Vue({
    router,
    render: h => h(App),
}).$mount('#app')
