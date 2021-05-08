import Vue from 'vue'
import App from './App.vue'
import VueElectron from 'vue-electron'
import {remote, app} from 'electron'

Vue.use(VueElectron)
Vue.config.productionTip = false
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

const Store = require('electron-store');

const store = new Store();
Vue.prototype.$electronStore = store

Vue.prototype.$electronApp = remote.app
Vue.prototype.$remote = remote
Vue.prototype.$currentWindow = remote.getCurrentWindow()
Vue.prototype.$webContents = remote.getCurrentWebContents()


const path = require('path')
let resourcesPath = path.join(__dirname, "..")
if (process.env.NODE_ENV === 'development') {
    resourcesPath = process.cwd()
}
Vue.prototype.$resourcesPath = resourcesPath

Vue.use(Antd)
new Vue({
    render: h => h(App),
}).$mount('#app')
