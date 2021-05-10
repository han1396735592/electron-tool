import Vue from 'vue'
import Router from 'vue-router'

try {
    const originalPush = Router.prototype.push
    Router.prototype.push = function push(location) {
        return originalPush.call(this, location).catch(err => err)
    }
} catch (e) {
}

Vue.use(Router)
import Home from "@views/Home";

import SerialportHelp from "@views/tool/SerialportHelp";
import AliIotMqttDtu from "@views/tool/AliIotMqttDtu";
import Index from "@views/tool/Index";

export default new Router({
    base: process.env.BASE_URL,
    scrollBehavior: () => ({y: 0}),
    routes: [{
        path: '/',
        component: Index
    }, {
        path: '/serialportHelp',
        component: SerialportHelp
    }]
})
