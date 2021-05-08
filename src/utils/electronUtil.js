import Vue from "vue";
import {remote} from "electron";

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
