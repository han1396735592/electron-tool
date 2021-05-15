const {ipcRenderer, remote} = require('electron')
import {machineIdSync} from "node-machine-id";
const Store = require('electron-store');
global.$electronStore = new Store();
let appPackage = require("../package.json");
let vueConfig = require('../vue.config')
let appId = vueConfig.pluginOptions.electronBuilder.builderOptions.appId
let machineId = machineIdSync();
window.appInfo = {
    machineId: machineId,
    appId: appId,
    version: appPackage.version
}

console.log(process.env)
